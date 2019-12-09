import { Connectors } from 'meteor/vulcan:core'
import _ from 'lodash'
import Offices from '../../offices/collection.js'
import { isEmptyValue } from '../../helpers.js'

/*
When updating an office on a project, also update that office with the project.
I get confused, so here's a description:

Where i represents the office(s) we're adding to our project,
project.offices[i] has { officeId, officeName }

But we actually get all offices, not just i, the new ones.

So for each of the project.offices we update office.projects of the Office with _id === officeId with
{
  projectId: project._id,
  projectTitle: project.projectTitle
}
*/

export function ProjectEditUpdateOfficeAfter (data, { document }) {
  const project = document
  if (!project.castingOfficeId) {
    return
  }

  const office = Offices.findOne(project.castingOfficeId) // TODO: error handling
  const newProject = {
    projectId: project._id
  }
  let newProjects = []

  // case 1: there are no projects on the office and office.projects is undefined
  if (!office.projects) {
    newProjects = [newProject]
  } else {
    const i = _.findIndex(office.projects, { projectId: project._id })
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

export function ProjectEditUpdateOfficeBefore (data, { document, oldDocument }) {
  const oldOffice = oldDocument.castingOfficeId
  const newOffice = document.castingOfficeId
  let adding = false
  if (newOffice && !oldOffice) {
    adding = true
  }
  let removing = false
  if (oldOffice && !newOffice) {
    // this is an office getting removed from the project, so we also need to remove the project from that office
    removing = true
  }
  let replacing = false
  if (newOffice && oldOffice && oldOffice !== newOffice) {
    // this is one office replacing another on the project
    removing = false
    replacing = true
  }
  let itmightnotbethereforsomereason = false
  if (newOffice === oldOffice) {
    console.info('itmightnotbethereforsomereason')
    itmightnotbethereforsomereason = true
  }

  let office = null
  let projects = null
  if (adding) {
    office = Offices.findOne(newOffice) // TODO: error handling
    projects = office && office.projects
  }
  if (removing || replacing || itmightnotbethereforsomereason) {
    office = Offices.findOne(oldOffice) // TODO: error handling
    projects = office && office.projects
  }
  if (!office) {
    console.log('findOne didn\'t find one office!')
    return
  }
  if (!isEmptyValue(projects)) {
    if (itmightnotbethereforsomereason) {
      if (_.indexOf(projects, { projectId: document._id }) < 0) {
        replacing = true
        console.info('itisnotthereforsomereason')
      }
    }
    _.remove(projects, function (p) {
      return p.projectId === document._id
    })
    if (adding || replacing) {
      projects.push({ projectId: document._id })
    }
    Connectors.update(Offices, office._id, {
      $set: {
        projects: projects,
        updatedAt: new Date()
      }
    })
  } else if (adding || itmightnotbethereforsomereason) { // means we are adding to empty (or null) projects
    projects = [{ projectId: document._id }]
    Connectors.update(Offices, office._id, {
      $set: {
        projects: projects,
        updatedAt: new Date()
      }
    })
  }
}
