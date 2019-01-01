import { addCallback, Connectors, createMutator, deleteMutator } from 'meteor/vulcan:core'
import Contacts from '../contacts/collection.js'
import Offices from '../offices/collection.js'
import Projects from '../projects/collection.js'
import PastProjects from './collection.js'
import { isEmptyValue } from '../helpers.js'
import { ACTIVE_PROJECT_STATUSES_ARRAY } from '../constants.js'
import _ from 'lodash'

/*
When updating a contact on a pastproject, also update that contact with the pastproject.
I get confused, so here's a description:

Where i represents the contact(s) we're adding to our pastproject,
pastproject.contacts[i] has { contactId, contactName, contactTitle }

But we actually get all contacts, not just i, the new ones.

So for each of the pastproject.contacts we update contact.pastprojects of the Contact with _id === contactId with
{
  projectId: project._id,
  projectTitle: project.projectTitle,
  titleForProject: projectContact.contactTitle
}

TODO: For some reason, the contact's `updatedAt` field doesn't get a `moment().format("YYYY-MM-DD HH:mm:ss")` `onEdit`
*/
function PastProjectEditUpdateContacts (project) {
  if (!project.contacts) {
    return
  }

  project.contacts.forEach(projectContact => {
    const contact = Contacts.findOne(projectContact.contactId) // TODO: error handling
    const newProject = {
      projectId: project._id,
      projectTitle: project.projectTitle,
      titleForProject: projectContact.contactTitle
    }

    if (_.includes(ACTIVE_PROJECT_STATUSES_ARRAY, project.status)) {
      // past-project is becoming a project
      var newProjects = []
      // case 1: there are no contacts on the project and project.contacts is undefined
      if (!contact.projects) {
        newProjects = [newProject]
      } else {
        const i = _.findIndex(contact.projects, { projectId: project._id })
        newProjects = contact.projects
        if (i < 0) {
          // case 2: this contact is not on this project but other contacts are and we're adding this contact
          newProjects.push(newProject)
        } else {
          // case 3: this contact is on this project and we're updating the info
          newProjects[i] = newProject
        }
      }
      const sortedProjects = _.sortBy(newProjects, ['projectTitle'])
      Connectors.update(Contacts, contact._id, { $set: { projects: sortedProjects } })

      // also remove the past-project from contact.pastProjects
      if (!isEmptyValue(contact.pastProjects)) {
        var newPastProjects = contact.pastProjects
        const i = _.findIndex(contact.pastProjects, { projectId: project._id })
        if (i > -1) {
          newProjects.splice(i, 1)
          Connectors.update(Contacts, contact._id, { $set: { pastProjects: newPastProjects } })
        }
      }
    } else {
      // past-project remains a past-project
      newPastProjects = []
      // case 1: there are no past-projects on the contact and contact.pastProjects is undefined
      if (isEmptyValue(contact.pastProjects)) {
        newPastProjects = [newProject]
      } else {
        const i = _.findIndex(contact.pastProjects, { projectId: project._id })
        newPastProjects = contact.pastProjects
        if (i < 0) {
          // case 2: this past-project is not on this contact but other past-projects are and we're adding this past-project
          newPastProjects.push(newProject)
        } else {
          // case 3: this past-project is on this contact and we're updating the info
          newPastProjects[i] = newProject
        }
      }
      Connectors.update(Contacts, contact._id, { $set: { pastProjects: newPastProjects } })
    }
  })
}

/*
When updating a office on a project, also update that office with the project.
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
function PastProjectEditUpdateOffice (project) {
  if (!project.castingOffice) {
    return
  }

  const office = Offices.findOne(project.castingOffice) // TODO: error handling
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
  Connectors.update(Offices, office._id, { $set: { projects: newProjects } })
}

function PastProjectEditUpdateOfficeBefore (data, { currentUser, document, newDocument, collection, context }) {
  const oldOffice = document.castingOffice
  const newOffice = newDocument.castingOffice
  // this is an office getting removed from the project,
  // so we also need to remove the project from that office
  var doIt = false
  if (oldOffice && !newOffice) {
    doIt = true
  }
  if (newOffice && oldOffice && oldOffice.length === newOffice.length && oldOffice !== newOffice) {
    doIt = true
  }
  // only do this when removing or replacing, so
  // newOffice is undefined and oldOffice is an _id or they're both _id's
  if (doIt) {
    const office = Offices.findOne(oldOffice) // TODO: error handling
    var projects = office.projects
    if (!isEmptyValue(projects)) {
      const i = _.findIndex(projects, { projectId: document._id })
      projects.splice(i, 1)
      Connectors.update(Offices, office._id, { $set: { projects: projects } })
    }
  }
}

async function PastProjectUpdateStatus ({ currentUser, document, newDocument }) {
  // if the new status is now an active project, create new project then remove this past project
  const newIsActive = _.includes(ACTIVE_PROJECT_STATUSES_ARRAY, newDocument.status)
  console.log('PastProjectUpdateStatus says newIsActive is', newIsActive)

  const createNewProject = async () => {
    try {
      return await createMutator({
        collection: Projects,
        document: newDocument,
        currentUser: currentUser,
        validate: false
      })
    } catch (err) {
      console.error('error in createNewProject:', err)
    }
  }

  const deletePastProject = async () => {
    try {
      return await deleteMutator({
        collection: PastProjects,
        documentId: document._id,
        currentUser: currentUser,
        validate: false
      })
    } catch (err) {
      console.error('error in deletePastProject:', err)
    }
  }

  if (newIsActive) {
    const newProject = await createNewProject()
    console.log('PastProjectUpdateStatus created project', newProject)
    // if the new project is created and matches (TODO: matches what, exactly?), delete current
    if (newProject.data.projectTitle === newDocument.projectTitle) {
      const deletedPastProject = await deletePastProject()
      console.log('PastProjectUpdateStatus deleted past project', deletedPastProject)
    }
  }
}

addCallback('pastproject.update.async', PastProjectUpdateStatus)
addCallback('pastproject.update.after', PastProjectEditUpdateContacts)
addCallback('pastproject.update.after', PastProjectEditUpdateOffice)
addCallback('pastproject.update.before', PastProjectEditUpdateOfficeBefore)
addCallback('pastproject.create.after', PastProjectEditUpdateContacts)
addCallback('pastproject.create.after', PastProjectEditUpdateOffice)
