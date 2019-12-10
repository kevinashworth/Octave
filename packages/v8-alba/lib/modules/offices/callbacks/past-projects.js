import { Connectors } from 'meteor/vulcan:core'
import _ from 'lodash'
import PastProjects from '../../past-projects/collection.js'
import { isEmptyValue } from '../../helpers.js'

export function OfficeEditUpdatePastProjects (data, { document, originalDocument }) {
  // console.group('OfficeEditUpdatePastProjects:')
  // console.info('from document:', document.pastProjects)
  // console.info('from originalDocument:', originalDocument.pastProjects)
  // console.groupEnd()

  // [a] if the two `pastProjects` arrays are equal, do nothing
  // [b] else for deleted pastProjects in oldOffice but not newOffice, remove castingOfficeId from those pastProjects
  // [c] and for added pastProjects in newOffice but not oldOffice, add castingOfficeId to those pastProjects

  const office = document
  let pastProjectsToRemoveThisOfficeFrom = null
  let pastProjectsToAddThisOfficeTo = null

  if (!originalDocument) { // newly created office, skipt to --> [c] add office to these pastProjects, if any
    if (!isEmptyValue(office.pastProjects)) {
      pastProjectsToAddThisOfficeTo = office.pastProjects
    } else {
      return
    }
  } else {
    const newOffice = document
    const oldOffice = originalDocument

    pastProjectsToAddThisOfficeTo = _.differenceWith(newOffice.pastProjects, oldOffice.pastProjects, _.isEqual)
    pastProjectsToRemoveThisOfficeFrom = _.differenceWith(oldOffice.pastProjects, newOffice.pastProjects, _.isEqual)

    console.log('pastProjectsToRemoveThisOfficeFrom:', pastProjectsToRemoveThisOfficeFrom)
    console.log('pastProjectsToAddThisOfficeTo:', pastProjectsToAddThisOfficeTo)
  //
  //
  //   const oldOfficePastProjectsLength = oldOffice.pastProjects ? oldOffice.pastProjects.length : 0
  //   const newOfficePastProjectsLength = newOffice.pastProjects ? newOffice.pastProjects.length : 0
  //   // [a]
  //   if (oldOfficePastProjectsLength === newOfficePastProjectsLength && newOfficePastProjectsLength === 0) {
  //     return
  //   }
  //   if (oldOfficePastProjectsLength && newOfficePastProjectsLength && _.isEqual(oldOffice.pastProjects, newOffice.pastProjects)) {
  //     return
  //   }
  //   // [b]
  //   pastProjectsToRemoveThisOfficeFrom = _.difference(oldOffice.pastProjects, newOffice.pastProjects)
  //   // [c]
  //   pastProjectsToAddThisOfficeTo = _.difference(newOffice.pastProjects, oldOffice.pastProjects)
  //   console.group('OfficeEditUpdatePastProjects:')
  //   console.info('OfficeEditUpdatePastProjects lengths:', oldOfficePastProjectsLength, newOfficePastProjectsLength)
  //   console.info('pastProjectsToRemoveThisOfficeFrom:', pastProjectsToRemoveThisOfficeFrom)
  //   console.info('pastProjectsToAddThisOfficeTo:', pastProjectsToAddThisOfficeTo)
  //   console.groupEnd()
  }
  // // [b]
  if (pastProjectsToRemoveThisOfficeFrom) {
    pastProjectsToRemoveThisOfficeFrom.forEach(deletedPastProject => {
      const pastProject = PastProjects.findOne(deletedPastProject.projectId)
      if (pastProject.castingOfficeId === office._id) {
        Connectors.update(PastProjects, pastProject._id, {
          $unset: {
            castingOfficeId: 1,
            // updatedAt: new Date() 2019-11-22: let's not update the date of ancient projects
          }
        })
      }
    })
  }
  // [c]
  if (pastProjectsToAddThisOfficeTo) {
    pastProjectsToAddThisOfficeTo.forEach(addedPastProject => {
      const pastProject = PastProjects.findOne(addedPastProject.projectId)
      Connectors.update(PastProjects, pastProject._id, {
      $set: {
        castingOfficeId: office._id,
        // updatedAt: new Date() 2019-11-22: let's not update the date of ancient projects
      }
      })
    })
  }
}
