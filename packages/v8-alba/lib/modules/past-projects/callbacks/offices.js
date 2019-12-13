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

  if (addingToNewOffice) {
    const newOffice = Promise.await(Offices.findOne(newOfficeId)) // TODO: error handling
    const currentNewOfficePastProjects = newOffice && newOffice.pastProjects
    // add this pastProject to the new office's pastProjects,
    // avoiding any potential duplication in case of database being slightly off
    // TODO: _.unionWith is best?
    const updatedNewOfficePastProjects = _.unionWith([{
      projectId: document._id,
      projectTitle: document.projectTitle
    }], currentNewOfficePastProjects, _.isEqual)
    Connectors.update(Offices, newOfficeId, {
      $set: {
        pastProjects: updatedNewOfficePastProjects,
        // updatedAt: new Date() // 2019-12-13: don't want to modify ancient past projects' dates
      }
    })
  }
  if (removingFromOldOffice) {
    const oldOffice = Promise.await(Offices.findOne(oldOfficeId)) // TODO: error handling
    let oldOfficePastProjects = oldOffice && oldOffice.pastProjects

    _.remove(oldOfficePastProjects, function (p) {
      return p.projectId === document._id
    })

    if (isEmptyValue(oldOfficePastProjects)) {
      Connectors.update(Offices, oldOfficeId, {
        $unset: {
          pastProjects: 1
        }
      })
    } else {
      Connectors.update(Offices, oldOfficeId, {
        $set: {
          pastProjects: oldOfficePastProjects,
          // updatedAt: new Date() // 2019-12-13: don't want to modify ancient pastProjects' dates
        }
      })
    }
  }
}
