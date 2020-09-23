import { Connectors } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import remove from 'lodash/remove'
import log from 'loglevel'
import Offices from '../../../modules/offices/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

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

export function ProjectCreateUpdateOfficesAfter (document, properties) {
  const project = document
  if (isEmptyValue(project.offices)) {
    return
  }

  project.offices.forEach(officeOfProject => {
    const office = Offices.findOne(officeOfProject.officeId) // TODO: error handling
    const newProject = {
      projectId: project._id
    }
    let updatedOfficeProjects = []

    // case 1: there are no projects on the office and office.projects is undefined
    if (!office.projects) {
      updatedOfficeProjects = [newProject]
    } else {
      const i = findIndex(office.projects, { projectId: project._id })
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
  })
}

/* this one could be rewritten for multiple offices but using code previously created for multiple contacts, below */
// export function ProjectEditUpdateOfficeBefore (data, { document, originalDocument }) {
//   const oldOfficeId = originalDocument.castingOfficeId
//   const newOfficeId = document.castingOfficeId
//
//   if (newOfficeId === oldOfficeId) {
//     return
//   }
//   let addingToNewOffice = false
//   let removingFromOldOffice = false
//   if (newOfficeId && !oldOfficeId) {
//     addingToNewOffice = true
//   }
//   if (oldOfficeId && !newOfficeId) {
//     removingFromOldOffice = true
//   }
//   if ((newOfficeId && oldOfficeId) && (oldOfficeId !== newOfficeId)) {
//     addingToNewOffice = true
//     removingFromOldOffice = true
//   }
//
//   if (addingToNewOffice) {
//     const newOffice = Promise.await(Offices.findOne(newOfficeId)) // TODO: error handling
//     const currentNewOfficeProjects = newOffice && newOffice.projects
//     // add this project to the new office's projects,
//     // avoiding any potential duplication in case of database being slightly off
//     // TODO: _.unionWith is best?
//     const updatedNewOfficeProjects = _.unionWith([{
//       projectId: document._id,
//       projectTitle: document.projectTitle
//     }], currentNewOfficeProjects, _.isEqual)
//     Connectors.update(Offices, newOfficeId, {
//       $set: {
//         projects: updatedNewOfficeProjects,
//         updatedAt: new Date()
//       }
//     })
//   }
//
//   if (removingFromOldOffice) {
//     const oldOffice = Promise.await(Offices.findOne(oldOfficeId)) // TODO: error handling
//     let oldOfficeProjects = oldOffice && oldOffice.projects
//     _.remove(oldOfficeProjects, function (p) {
//       return p.projectId === document._id
//     })
//     if (isEmptyValue(oldOfficeProjects)) {
//       Connectors.update(Offices, oldOfficeId, {
//         $unset: {
//           projects: 1
//         }
//       })
//     } else {
//       Connectors.update(Offices, oldOfficeId, {
//         $set: {
//           projects: oldOfficeProjects,
//           updatedAt: new Date()
//         }
//       })
//     }
//   }
// }

export function ProjectEditUpdateOfficesBefore (data, { document, originalDocument }) {
  // [a] if the two `offices` arrays are equal, do nothing
  // [b] else for deleted offices in oldProject but not newProject, remove project from those offices
  // [c] and for added offices in newProject but not oldProject, add project to those offices

  // TODO: what happens when Project becomes PastProject ???

  const project = document
  let officesToRemoveThisProjectFrom = []
  let officesToAddThisProjectTo = []
  const newProject = document
  const oldProject = originalDocument
  officesToAddThisProjectTo = differenceWith(newProject.offices, oldProject.offices, isEqual)
  officesToRemoveThisProjectFrom = differenceWith(oldProject.offices, newProject.offices, isEqual)
  log.debug('ProjectEditUpdateOfficesBefore:')
  log.debug('officesToRemoveThisProjectFrom:', officesToRemoveThisProjectFrom)
  log.debug('officesToAddThisProjectTo:', officesToAddThisProjectTo)

  // [b]
  if (officesToRemoveThisProjectFrom) {
    officesToRemoveThisProjectFrom.forEach(deletedOffice => {
      const oldOffice = Offices.findOne(deletedOffice.officeId)
      const oldOfficeProjects = oldOffice && oldOffice.projects

      remove(oldOfficeProjects, function (p) {
        return p.projectId === document._id
      })

      if (isEmptyValue(oldOfficeProjects)) {
        Connectors.update(Offices, oldOffice._id, {
          $unset: {
            projects: 1
          }
        })
      } else {
        Connectors.update(Offices, oldOffice._id, {
          $set: {
            projects: oldOfficeProjects,
            updatedAt: new Date()
          }
        })
      }
    })
  }

  // [c]
  if (officesToAddThisProjectTo) {
    officesToAddThisProjectTo.forEach(addedOffice => {
      const office = Offices.findOne(addedOffice.officeId)
      const updatedProject = {
        projectId: project._id,
        projectTitle: project.projectTitle
      }
      let updatedProjects = []
      // case 1: nothing there
      if (isEmptyValue(office.projects)) {
        updatedProjects = [updatedProject]
      } else {
        updatedProjects = office.projects
        const i = findIndex(office.projects, { projectId: project._id })
        if (i < 0) {
          // case 2: add to it
          updatedProjects.push(updatedProject)
        } else {
          // case 3: already there
          return
        }
      }
      Connectors.update(Offices, office._id, {
        $set: {
          projects: updatedProjects,
          updatedAt: new Date()
        }
      })
    })
  }
}
