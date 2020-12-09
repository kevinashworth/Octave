import { Connectors } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import log from 'loglevel'
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
  } else { // compare differences only by id
    const newOfficePastProjects = document.pastProjects ? document.pastProjects.map((project) => ({ projectId: project.projectId })) : null
    const oldOfficePastProjects = originalDocument.pastProjects ? originalDocument.pastProjects.map((project) => ({ projectId: project.projectId })) : null
    pastProjectsToAddThisOfficeTo = differenceWith(newOfficePastProjects, oldOfficePastProjects, isEqual)
    pastProjectsToRemoveThisOfficeFrom = differenceWith(oldOfficePastProjects, newOfficePastProjects, isEqual)
    log.debug('OfficeEditUpdatePastProjects:')
    log.debug('pastProjectsToAddThisOfficeTo:', pastProjectsToAddThisOfficeTo)
    log.debug('pastProjectsToRemoveThisOfficeFrom:', pastProjectsToRemoveThisOfficeFrom)
  }
  // [b]
  if (pastProjectsToRemoveThisOfficeFrom) {
    pastProjectsToRemoveThisOfficeFrom.forEach(projectToUpdate => {
      const pastProject = PastProjects.findOne(projectToUpdate.projectId)
      const i = findIndex(pastProject.offices, ['officeId', office._id])
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
      if (projectToUpdate.offices === undefined) {
        Connectors.update(PastProjects, projectToUpdate.projectId, {
          $set: {
            offices: [{ officeId: office._id }]
          }
        })
      } else {
        Connectors.update(PastProjects, projectToUpdate.projectId, {
          $addToSet: {
            offices: { officeId: office._id }
          }
        })
      }
    })
  }
}
