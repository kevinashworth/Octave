import { Connectors } from 'meteor/vulcan:core'
import _ from 'lodash'
import PastProjects from '../../../modules/past-projects/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

export function OfficeEditUpdatePastProjects (data, { document, originalDocument }) {
  // [a] if the two `pastProjects` arrays are equal, do nothing
  // [b] else for deleted pastProjects in oldOffice but not newOffice, remove officeId from those pastProjects
  // [c] and for added pastProjects in newOffice but not oldOffice, add officeId to those pastProjects

  const office = document
  let pastProjectsToRemoveThisOfficeFrom = null
  let pastProjectsToAddThisOfficeTo = null

  if (!originalDocument) { // newly created office, skip to --> [c] add office to these pastProjects, if any
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
    console.group('OfficeEditUpdatePastProjects:')
    console.info('pastProjectsToAddThisOfficeTo:', pastProjectsToAddThisOfficeTo)
    console.info('pastProjectsToRemoveThisOfficeFrom:', pastProjectsToRemoveThisOfficeFrom)
    console.groupEnd()
  }
  // [b]
  if (pastProjectsToRemoveThisOfficeFrom) {
    pastProjectsToRemoveThisOfficeFrom.forEach(projectToUpdate => {
      var pastProject = PastProjects.findOne(projectToUpdate.projectId)
      const i = _.findIndex(pastProject.offices, ['officeId', office._id])
      if (i > -1) {
        pastProject.offices.splice(i, 1)
        Connectors.update(PastProjects, pastProject._id, {
          $set: {
            ...pastProject
          }
        })
      }
    })
  }
  // [c]
  if (pastProjectsToAddThisOfficeTo) {
    pastProjectsToAddThisOfficeTo.forEach(projectToUpdate => {
      Connectors.update(PastProjects, projectToUpdate.projectId, {
        $addToSet: {
          offices: { officeId: office._id }
        }
      })
    })
  }
}
