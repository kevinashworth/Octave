import { Connectors } from 'meteor/vulcan:core'
import _ from 'lodash'
import Offices from '../../offices/collection.js'
import { isEmptyValue } from '../../helpers.js'

/*
When updating a office on a pastProject, also update that office with the pastProject.
I get confused, so here's a description:

Where i represents the office(s) we're adding to our pastProject,
pastProject.offices[i] has { officeId, officeName }

But we actually get all offices, not just i, the new ones.

So for each of the pastProject.offices we update office.pastProjects of the Office with _id === officeId with
{
  projectId: pastProject._id,
  projectTitle: project.projectTitle
}
*/
/* This is for Past Projects created from scratch, not Projects turned into Past Projects so disabling this until becomes useful */
// export function PastProjectCreateUpdateOfficeAfter (document, properties) {
//   const pastProject = document
//   if (!pastProject.castingOfficeId) {
//     return
//   }
//
//   const office = Offices.findOne(pastProject.castingOfficeId) // TODO: error handling
//   const newPastProject = {
//     projectId: pastProject._id
//   }
//   let updatedPastProjects = []
//
//   // case 1: there are no pastProjects on the office and office.pastProjects is undefined
//   if (!office.pastProjects) {
//     updatedPastProjects = [newPastProject]
//   } else {
//     const i = _.findIndex(office.pastProjects, { projectId: pastProject._id })
//     if (i < 0) {
//       // case 2: this pastProject is not on this office but other pastProjects are and we're adding this pastProject
//       updatedPastProjects = office.pastProjects
//       updatedPastProjects.push(newPastProject)
//     } else {
//       // case 3: this pastProject is on this office and we're updating the info
//       updatedPastProjects[i] = newPastProject
//     }
//   }
//   Connectors.update(Offices, office._id, {
//     $set: {
//       pastProjects: updatedPastProjects,
//       // updatedAt: new Date()
//     }
//   })
// }

export function PastProjectEditUpdateOfficeBefore (data, { document, originalDocument }) {
  const oldOffice = originalDocument.castingOfficeId
  const newOffice = document.castingOfficeId
  let adding = false
  if (newOffice && !oldOffice) {
    adding = true
  }
  let removing = false
  if (oldOffice && !newOffice) {
    // this is an office getting removed from the project, so we also need to remove the project from that office
    removing = true
  }
  let replacing = false
  if (newOffice && oldOffice && oldOffice !== newOffice) {
    // this is one office replacing another on the project
    removing = false
    replacing = true
  }
  let itmightnotbethereforsomereason = false
  if (newOffice === oldOffice) {
    console.info('itmightnotbethereforsomereason')
    itmightnotbethereforsomereason = true
  }

  let office = null
  let pastProjects = null
  if (adding) {
    office = Offices.findOne(newOffice) // TODO: error handling
    pastProjects = office && office.pastProjects
  }
  if (removing || replacing || itmightnotbethereforsomereason) {
    office = Offices.findOne(oldOffice) // TODO: error handling
    pastProjects = office && office.pastProjects
  }
  if (!office) {
    console.log('findOne didn\'t find one office!')
    return
  }
  if (!isEmptyValue(pastProjects)) {
    if (itmightnotbethereforsomereason) {
      if (_.indexOf(pastProjects, { projectId: document._id }) < 0) {
        replacing = true
        console.info('itisnotthereforsomereason')
      }
    }
    _.remove(pastProjects, function (p) {
      return p.projectId === document._id
    })
    if (adding || replacing) {
      pastProjects.push({ projectId: document._id })
    }
    Connectors.update(Offices, office._id, {
      $set: {
        pastProjects: pastProjects,
        updatedAt: new Date()
      }
    })
  } else if (adding || itmightnotbethereforsomereason) { // means we are adding to empty (or null) projects
    pastProjects = [{ projectId: document._id }]
    Connectors.update(Offices, office._id, {
      $set: {
        pastProjects: pastProjects,
        updatedAt: new Date()
      }
    })
  }
}
