import { Connectors } from 'meteor/vulcan:core'
import _ from 'lodash'
import Offices from '../../offices/collection.js'
import { isEmptyValue } from '../../helpers.js'

/*
When updating an office on a project, also update that office with the project.
I get confused, so here's a description:

Where i represents the office(s) we're adding to our project,
project.offices[i] has { officeId, officeName }

But we actually get all offices, not just i, the new ones.

So for each of the project.offices we update office.projects of the Office with _id === officeId with
{
  projectId: project._id,
  projectTitle: project.projectTitle
}
*/

export function ProjectCreateUpdateOfficeAfter (document, properties) {
  const project = document
  if (!project.castingOfficeId) {
    return
  }

  const office = Offices.findOne(project.castingOfficeId) // TODO: error handling
  const newProject = {
    projectId: project._id
  }
  let updatedOfficeProjects = []

  // case 1: there are no projects on the office and office.projects is undefined
  if (!office.projects) {
    updatedOfficeProjects = [newProject]
  } else {
    const i = _.findIndex(office.projects, { projectId: project._id })
    updatedOfficeProjects = office.projects
    if (i < 0) {
      // case 2: this project is not on this office but other projects are and we're adding this project
      updatedOfficeProjects.push(newProject)
    } else {
      // case 3: this project is on this office and we're updating the info
      updatedOfficeProjects[i] = newProject
    }
  }
  Connectors.update(Offices, office._id, {
    $set: {
      projects: updatedOfficeProjects,
      updatedAt: new Date()
    }
  })
}

export function ProjectEditUpdateOfficeBefore (data, { document, originalDocument }) {
  console.group('ProjectEditUpdateOfficeBefore:')

  const oldOfficeId = originalDocument.castingOfficeId
  const newOfficeId = document.castingOfficeId

  if (newOfficeId === oldOfficeId) {
    return
  }

  let addingToNewOffice = false
  let removingFromOldOffice = false
  if (newOfficeId && !oldOfficeId) {
    addingToNewOffice = true
  }
  if (oldOfficeId && !newOfficeId) {
    removingFromOldOffice = true
  }
  if ((newOfficeId && oldOfficeId) && (oldOfficeId !== newOfficeId)) {
    addingToNewOffice = true
    removingFromOldOffice = true
  }

  console.log('oldOfficeId:', oldOfficeId)
  console.log('newOfficeId:', newOfficeId)
  console.log('removingFromOldOffice:', removingFromOldOffice)
  console.log('addingToNewOffice:', addingToNewOffice)

  if (addingToNewOffice) {
    let newOffice = Promise.await(Offices.findOne(newOfficeId)) // TODO: error handling
    let currentNewOfficeProjects = newOffice && newOffice.projects
    // add this project to the new office's projects,
    // avoiding any potential duplication in case of database being slightly off
    // TODO: _.unionWith is best?
    const updatedNewOfficeProjects = _.unionWith([{
        projectId: document._id,
        projectTitle: document.projectTitle
      }], currentNewOfficeProjects, _.isEqual
    )

    console.log('about to update', newOfficeId, 'with', updatedNewOfficeProjects)

    Connectors.update(Offices, newOfficeId, {
      $set: {
        projects: updatedNewOfficeProjects,
        updatedAt: new Date()
      }
    })
  }
  if (removingFromOldOffice) {
    let oldOffice = Promise.await(Offices.findOne(oldOfficeId)) // TODO: error handling
    let oldOfficeProjects = oldOffice && oldOffice.projects

    console.log('[KA] oldOfficeProjects:', oldOfficeProjects)

    // remove this project from old office's projects
    _.remove(oldOfficeProjects, function (p) {
      return p.projectId === document._id
    })

    console.log('[KA] _removed and now:', oldOfficeProjects)

    if (isEmptyValue(oldOfficeProjects)) {
      Connectors.update(Offices, oldOfficeId, {
        $unset: {
          projects: 1
        }
      })
    } else {
      Connectors.update(Offices, oldOfficeId, {
        $set: {
          projects: oldOfficeProjects,
          updatedAt: new Date()
        }
      })
    }
  }

  console.groupEnd()
}

  // if (!office) {
  //   console.log('[KA] ProjectCreateUpdateOfficeAfter findOne did not find one office!')
  //   return
  // }
  // if (!isEmptyValue(projects)) {
  //   if (adding) {
  //     projects.push({ projectId: document._id })
  //   } else if (removing) {
  //     _.remove(projects, function (p) {
  //       return p.projectId === document._id
  //     })
  //   } else if (replacing) {
  //     _.remove(projects, function (p) {
  //       return p.projectId === document._id
  //     })
  //     projects.push({ projectId: document._id })
  //   }
  //   Connectors.update(Offices, office._id, {
  //     $set: {
  //       projects: projects,
  //       updatedAt: new Date()
  //     }
  //   })
  // } else if (adding) { // for empty or null projects, only update if adding
  //   projects = [{ projectId: document._id }]
  //   Connectors.update(Offices, office._id, {
  //     $set: {
  //       projects: projects,
  //       updatedAt: new Date()
  //     }
  //   })
  // }
// }
