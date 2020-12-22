import { Connectors } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import remove from 'lodash/remove'
import log from 'loglevel'
import Projects from '../../../modules/projects/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

const handleAddProjects = (projects, office) => {
  const officeId = office._id
  projects.forEach(officeProject => {
    const project = Projects.findOne(officeProject.projectId) // TODO: error handling
    const newOffice = {
      officeId,
      officeName: office.displayName,
      officeTitle: officeProject.titleForProject
    }
    let newOffices = []

    // case 1: there are no offices on the project and project.offices is undefined
    if (!project.offices) {
      newOffices = [newOffice]
    } else {
      const i = findIndex(project.offices, { officeId })
      newOffices = project.offices
      if (i < 0) {
        // case 2: this office is not on this project but other offices are and we're adding this office
        newOffices.push(newOffice)
      } else {
        // case 3: this office is on this project and we're updating the info
        newOffices[i] = newOffice
      }
    }

    Connectors.update(Projects, project._id, {
      $set: {
        offices: newOffices,
        updatedAt: new Date()
      }
    })
  })
}

const handleRemoveProjects = (projects, officeId) => {
  projects.forEach(deletedProject => {
    try {
      const oldProject = Projects.findOne(deletedProject.projectId)
      const oldProjectOffices = oldProject && oldProject.offices
      remove(oldProjectOffices, function (p) { // `remove` mutates
        return p.officeId === officeId
      })
      if (isEmptyValue(oldProjectOffices)) {
        Connectors.update(Projects, oldProject._id, {
          $set: {
            updatedAt: new Date()
          },
          $unset: {
            offices: 1
          }
        })
      } else {
        Connectors.update(Projects, oldProject._id, {
          $set: {
            offices: oldProjectOffices,
            updatedAt: new Date()
          }
        })
      }
    } catch {
      log.error('handleRemoveProjects error, project', deletedProject.projectId)
    }
  })
}

const isSameProject = (a, b) => {
  return a.projectId === b.projectId
}

// callbacks.create.async
export const createOfficeUpdateProjects = ({ document }) => {
  const office = document
  if (!isEmptyValue(office.projects)) {
    handleAddProjects(office.projects, office)
  }
}

// callbacks.udpate.async
export const updateOfficeUpdateProjects = ({ document, originalDocument }) => {
  const newOffice = document
  const oldOffice = originalDocument
  const projectsThatWereAdded = differenceWith(newOffice.projects, oldOffice.projects, isSameProject)
  const projectsThatWereRemoved = differenceWith(oldOffice.projects, newOffice.projects, isSameProject)
  if (!isEmptyValue(projectsThatWereRemoved)) {
    handleRemoveProjects(projectsThatWereRemoved, newOffice._id)
  }
  if (!isEmptyValue(projectsThatWereAdded)) {
    handleAddProjects(projectsThatWereAdded, newOffice)
  }
}
