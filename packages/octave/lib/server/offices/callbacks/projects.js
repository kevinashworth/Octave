import { Connectors } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import log from 'loglevel'
import Projects from '../../../modules/projects/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

export function OfficeEditUpdateProjects (data, { document, originalDocument }) {
  // [a] if the two `projects` arrays are equal, do nothing
  // [b] else for deleted projects in oldOffice but not newOffice, remove officeId from those projects
  // [c] and for added projects in newOffice but not oldOffice, add officeId to those projects

  const office = document
  let projectsToRemoveThisOfficeFrom = null
  let projectsToAddThisOfficeTo = null

  if (!originalDocument) { // newly created office, skip to --> [c] add office to these projects, if any
    if (!isEmptyValue(office.projects)) {
      projectsToAddThisOfficeTo = office.projects
    } else {
      return
    }
  } else { // compare differences only by id
    const newOfficeProjects = document.projects ? document.projects.map((project) => ({ projectId: project.projectId })) : null
    const oldOfficeProjects = originalDocument.projects ? originalDocument.projects.map((project) => ({ projectId: project.projectId })) : null
    projectsToAddThisOfficeTo = differenceWith(newOfficeProjects, oldOfficeProjects, isEqual)
    projectsToRemoveThisOfficeFrom = differenceWith(oldOfficeProjects, newOfficeProjects, isEqual)
    log.debug('OfficeEditUpdateProjects:')
    log.debug('projectsToAddThisOfficeTo:', projectsToAddThisOfficeTo)
    log.debug('projectsToRemoveThisOfficeFrom:', projectsToRemoveThisOfficeFrom)
  }
  // [b]
  if (!isEmptyValue(projectsToRemoveThisOfficeFrom)) {
    projectsToRemoveThisOfficeFrom.forEach(projectToUpdate => {
      const project = Projects.findOne(projectToUpdate.projectId)
      if (project && project.offices) {
        const i = findIndex(project.offices, ['officeId', office._id])
        if (i > -1) {
          project.offices.splice(i, 1)
          Connectors.update(Projects, project._id, {
            $set: {
              ...project
            }
          })
        }
      }
    })
  }
  // [c]
  if (projectsToAddThisOfficeTo) {
    projectsToAddThisOfficeTo.forEach(projectToUpdate => {
      if (projectToUpdate.offices === undefined) {
        Connectors.update(Projects, projectToUpdate.projectId, {
          $set: {
            offices: [{ officeId: office._id }]
          }
        })
      } else {
        Connectors.update(Projects, projectToUpdate.projectId, {
          $addToSet: {
            offices: { officeId: office._id }
          }
        })
      }
    })
  }
}

export function OfficeCreateUpdateProjects (document, properties) {
  const office = document
  const projectsToAddThisOfficeTo = office.projects
  console.group('OfficeCreateUpdateProjects:')
  console.info('projectsToAddThisOfficeTo:', projectsToAddThisOfficeTo)
  console.groupEnd()

  if (!isEmptyValue(projectsToAddThisOfficeTo)) {
    projectsToAddThisOfficeTo.forEach(projectToUpdate => {
      if (projectToUpdate.offices === undefined) {
        Connectors.update(Projects, projectToUpdate.projectId, {
          $set: {
            offices: [{ officeId: office._id }]
          }
        })
      } else {
        Connectors.update(Projects, projectToUpdate.projectId, {
          $addToSet: {
            offices: { officeId: office._id }
          }
        })
      }
    })
  }
}
