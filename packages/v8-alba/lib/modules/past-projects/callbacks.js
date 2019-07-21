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
When updating a office on a pastProject, also update that office with the pastProject.
I get confused, so here's a description:

Where i represents the office(s) we're adding to our pastProject,
pastProject.offices[i] has { officeId, officeName }

But we actually get all offices, not just i, the new ones.

So for each of the pastProject.offices we update office.pastProjects of the Office with _id === officeId with
{
  projectId: pastProject._id
}
*/
function PastProjectEditUpdateOffice (data, { document }) {
  const pastProject = document
  if (!pastProject.castingOfficeId) {
    return
  }

  const office = Offices.findOne(pastProject.castingOfficeId) // TODO: error handling
  const newPastProject = {
    projectId: pastProject._id
  }
  let newPastProjects = []

  // case 1: there are no pastProjects on the office and office.pastProjects is undefined
  if (!office.pastProjects) {
    newPastProjects = [newPastProject]
  } else {
    const i = _.findIndex(office.pastProjects, { projectId: pastProject._id })
    newPastProjects = office.pastProjects
    if (i < 0) {
      // case 2: this pastProject is not on this office but other pastProjects are and we're adding this pastProject
      newPastProjects.push(newPastProject)
    } else {
      // case 3: this pastProject is on this office and we're updating the info
      newPastProjects[i] = newPastProject
    }
  }
  Connectors.update(Offices, office._id, { $set: { pastProjects: newPastProjects } })
}

function PastProjectEditUpdateOfficeBefore (data, { currentUser, document, oldDocument, collection, context }) {
  const oldOffice = oldDocument.castingOfficeId
  const newOffice = document.castingOfficeId
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
    var pastProjects = office.pastProjects
    if (!isEmptyValue(pastProjects)) {
      _.remove(pastProjects, function(p) {
        return p._id === document._id
      })
      Connectors.update(Offices, office._id, { $set: { pastProjects: pastProjects } })
    }
  }
}

async function PastProjectUpdateStatusAsync ({ currentUser, document, oldDocument }) {
  // if the new status is now an active project, create a new project then remove this past-project
  const newStatusIsActive = _.includes(ACTIVE_PROJECT_STATUSES_ARRAY, document.status)
  console.log('PastProjectUpdateStatusAsync says newStatusIsActive is', newStatusIsActive)

  const createNewProject = async () => {
    try {
      return await createMutator({
        collection: Projects,
        document: document,
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

  if (newStatusIsActive) {
    const newProject = (await createNewProject()).data
    console.log('PastProjectUpdateStatusAsync created project:', newProject)

    // if the new project is created and matches (TODO: matches what, exactly?), delete current
    if (newProject.projectTitle === document.projectTitle) {
      const deletedPastProject = await deletePastProject()
      console.log('PastProjectUpdateStatusAsync deleted past-project:', deletedPastProject)
    }

    if (document.castingOfficeId) {
      let pastProjects = []
      let projects = []
      const office = Offices.findOne(document.castingOfficeId)
      if (office.pastProjects && office.pastProjects.length) {
        pastProjects = office.pastProjects
        _.remove(pastProjects, function(p) {
          return p._id === document._id
        })
      }
      if (office.projects && office.projects.length) {
        projects = office.projects
      }
      projects.push({ projectId: newProject._id })
      Connectors.update(Offices, document.castingOfficeId, { $set: {
        pastProjects,
        projects
      } })
    }
  }
}

addCallback('pastproject.update.async', PastProjectUpdateStatusAsync)
addCallback('pastproject.update.after', PastProjectEditUpdateContacts)
addCallback('pastproject.update.after', PastProjectEditUpdateOffice)
addCallback('pastproject.update.before', PastProjectEditUpdateOfficeBefore)
addCallback('pastproject.create.after', PastProjectEditUpdateContacts)
addCallback('pastproject.create.after', PastProjectEditUpdateOffice)
