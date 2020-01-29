import { Connectors } from 'meteor/vulcan:core'
import _ from 'lodash'
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
  } else {
    const newOffice = document
    const oldOffice = originalDocument
    projectsToAddThisOfficeTo = _.differenceWith(newOffice.projects, oldOffice.projects, _.isEqual)
    projectsToRemoveThisOfficeFrom = _.differenceWith(oldOffice.projects, newOffice.projects, _.isEqual)
    console.group('OfficeEditUpdateProjects:')
    console.info('projectsToAddThisOfficeTo:', projectsToAddThisOfficeTo)
    console.info('projectsToRemoveThisOfficeFrom:', projectsToRemoveThisOfficeFrom)
    console.groupEnd()
  }
  // [b]
  if (projectsToRemoveThisOfficeFrom) {
    projectsToRemoveThisOfficeFrom.forEach(projectToUpdate => {
      var project = Projects.findOne(projectToUpdate.projectId)
      const i = _.findIndex(project.offices, ['officeId', office._id])
      if (i > -1) {
        project.offices.splice(i, 1)
        Connectors.update(Projects, project._id, {
          $set: {
            ...project
          }
        })
      }
    })
  }
  // [c]
  if (projectsToAddThisOfficeTo) {
    projectsToAddThisOfficeTo.forEach(projectToUpdate => {
      Connectors.update(Projects, projectToUpdate.projectId, {
        $addToSet: {
          offices: { officeId: office._id }
        }
      })
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
      Connectors.update(Projects, projectToUpdate.projectId, {
        $addToSet: {
          offices: { officeId: office._id }
        }
      })
    })
  }
}
