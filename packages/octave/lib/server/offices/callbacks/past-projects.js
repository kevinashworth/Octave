import { Connectors } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import remove from 'lodash/remove'
import log from 'loglevel'
import PastProjects from '../../../modules/past-projects/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

const handleAddPastProjects = (pastprojects, office) => {
  const officeId = office._id
  pastprojects.forEach(officeProject => {
    const pastproject = PastProjects.findOne(officeProject.projectId) // TODO: error handling
    const newOffice = {
      officeId,
      officeName: office.displayName,
      officeTitle: officeProject.titleForProject
    }
    let newOffices = []

    // case 1: there are no offices on the pastproject and pastproject.offices is undefined
    if (!pastproject.offices) {
      newOffices = [newOffice]
    } else {
      const i = findIndex(pastproject.offices, { officeId })
      newOffices = pastproject.offices
      if (i < 0) {
        // case 2: this office is not on this pastproject but other offices are and we're adding this office
        newOffices.push(newOffice)
      } else {
        // case 3: this office is on this pastproject and we're updating the info
        newOffices[i] = newOffice
      }
    }

    Connectors.update(PastProjects, pastproject._id, {
      $set: {
        offices: newOffices,
        updatedAt: new Date()
      }
    })
  })
}

const handleRemovePastProjects = (pastprojects, officeId) => {
  pastprojects.forEach(deletedPastProject => {
    try {
      const oldProject = PastProjects.findOne(deletedPastProject.projectId)
      const oldProjectOffices = oldProject && oldProject.offices
      remove(oldProjectOffices, function (p) { // `remove` mutates
        return p.officeId === officeId
      })
      if (isEmptyValue(oldProjectOffices)) {
        Connectors.update(PastProjects, oldProject._id, {
          $set: {
            updatedAt: new Date()
          },
          $unset: {
            offices: 1
          }
        })
      } else {
        Connectors.update(PastProjects, oldProject._id, {
          $set: {
            offices: oldProjectOffices,
            updatedAt: new Date()
          }
        })
      }
    } catch {
      log.error('handleRemovePastProjects error, pastproject', deletedPastProject.projectId)
    }
  })
}

const isSamePastProject = (a, b) => {
  return a.projectId === b.projectId
}

// callbacks.create.async
export const createOfficeUpdatePastProjects = ({ document }) => {
  const office = document
  if (!isEmptyValue(office.pastProjects)) {
    handleAddPastProjects(office.pastProjects, office)
  }
}

// callbacks.udpate.async
export const updateOfficeUpdatePastProjects = ({ document, originalDocument }) => {
  const newOffice = document
  const oldOffice = originalDocument
  const pastProjectsThatWereAdded = differenceWith(newOffice.pastProjects, oldOffice.pastProjects, isSamePastProject)
  const pastProjectsThatWereRemoved = differenceWith(oldOffice.pastProjects, newOffice.pastProjects, isSamePastProject)
  if (!isEmptyValue(pastProjectsThatWereRemoved)) {
    handleRemovePastProjects(pastProjectsThatWereRemoved, newOffice._id)
  }
  if (!isEmptyValue(pastProjectsThatWereAdded)) {
    handleAddPastProjects(pastProjectsThatWereAdded, newOffice)
  }
}

