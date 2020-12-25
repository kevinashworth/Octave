import { Connectors } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import remove from 'lodash/remove'
import log from 'loglevel'
import Offices from '../../../modules/offices/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

// callbacks.create.async
export const createProjectUpdateOffices = ({ document }) => {
  const project = document
  if (!isEmptyValue(project.offices)) {
    handleAddOffices(project.offices, project)
  }
}

// callbacks.udpate.async
export const updateProjectUpdateOffices = ({ document, originalDocument }) => {
  const newProject = document
  const oldProject = originalDocument
  const officesThatWereAdded = differenceWith(newProject.offices, oldProject.offices, isSameOffice)
  const officesThatWereRemoved = differenceWith(oldProject.offices, newProject.offices, isSameOffice)
  // log.debug('updateProjectUpdateOffices:')
  // log.debug('officesThatWereAdded:', officesThatWereAdded)
  // log.debug('officesThatWereRemoved:', officesThatWereRemoved)
  if (!isEmptyValue(officesThatWereRemoved)) {
    handleRemoveOffices(officesThatWereRemoved, newProject._id)
  }
  if (!isEmptyValue(officesThatWereAdded)) {
    handleAddOffices(officesThatWereAdded, newProject)
  }
}

const handleAddOffices = (offices, project) => {
  const projectId = project._id
  offices.forEach(projectOffice => {
    const office = Offices.findOne(projectOffice.officeId)
    if (office) {
      const newProject = {
        projectId,
        projectName: project.displayName
      }
      let newProjects = []

      // case 1: there are no projects on the office and office.projects is undefined
      if (!office.projects) {
        newProjects = [newProject]
      } else {
        const i = findIndex(office.projects, { projectId })
        newProjects = office.projects
        if (i < 0) {
          // case 2: this project is not on this office but other projects are and we're adding this project
          newProjects.push(newProject)
        } else {
          // case 3: this project is on this office and we're updating the info
          newProjects[i] = newProject
        }
      }

      Connectors.update(Offices, office._id, {
        $set: {
          projects: newProjects,
          updatedAt: new Date()
        }
      })
    }
  })
}

const handleRemoveOffices = (offices, projectId) => {
  offices.forEach(deletedOffice => {
    const oldOffice = Offices.findOne(deletedOffice.officeId)
    if (oldOffice) {
      const oldOfficeProjects = oldOffice.projects
      remove(oldOfficeProjects, function (p) { // `remove` mutates
        return p.projectId === projectId
      })
      if (isEmptyValue(oldOfficeProjects)) {
        Connectors.update(Offices, oldOffice._id, {
          $set: {
            updatedAt: new Date()
          },
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
    }
  })
}

const isSameOffice = (a, b) => {
  return a.officeId === b.officeId
}
