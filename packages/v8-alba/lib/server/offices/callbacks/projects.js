import { Connectors } from 'meteor/vulcan:core'
import _ from 'lodash'
import Projects from '../../../modules/projects/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

export function OfficeEditUpdateProjects (data, { document, originalDocument }) {
  // [a] if the two `projects` arrays are equal, do nothing
  // [b] else for deleted projects in oldOffice but not newOffice, remove castingOfficeId from those projects
  // [c] and for added projects in newOffice but not oldOffice, add castingOfficeId to those projects

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
    console.group('OfficeEditUpdateContacts:')
    console.info('projectsToRemoveThisOfficeFrom:', projectsToRemoveThisOfficeFrom)
    console.info('projectsToAddThisOfficeTo:', projectsToAddThisOfficeTo)
    console.groupEnd()
  }
  // [b]
  if (projectsToRemoveThisOfficeFrom) {
    projectsToRemoveThisOfficeFrom.forEach(deletedProject => {
      const project = Projects.findOne(deletedProject.projectId)
      if (project.castingOfficeId === office._id) {
        Connectors.update(Projects, project._id, {
          $unset: {
            castingOfficeId: 1,
            updatedAt: new Date()
          }
        })
      }
    })
  }
  // [c]
  if (projectsToAddThisOfficeTo) {
    projectsToAddThisOfficeTo.forEach(addedProject => {
      const project = Projects.findOne(addedProject.projectId)
      Connectors.update(Projects, project._id, {
        $set: {
          castingOfficeId: office._id,
          updatedAt: new Date()
        }
      })
    })
  }
}
