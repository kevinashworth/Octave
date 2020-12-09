import { Connectors } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import remove from 'lodash/remove'
import Projects from '../../../modules/projects/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

// callbacks.update.before
// for unknown reasons, projectTitle is sometimes missing
export const updateProjectTitles = (data) => {
  if (isEmptyValue(data.projects)) {
    return data
  }
  data.projects.map(project => {
    if (isEmptyValue(project.projectTitle)) {
      const getProject = Projects.findOne(project.projectId)
      project.projectTitle = getProject.projectTitle
    }
    return project
  })
  return data
}

// callbacks.create.async
export const createContactUpdateProjects = ({ document }) => {
  const contact = document
  if (!isEmptyValue(contact.projects)) {
    handleAddProjects(contact.projects, contact)
  }
}

// callbacks.udpate.async
export const updateContactUpdateProjects = ({ document, originalDocument }) => {
  const newContact = document
  const oldContact = originalDocument
  const projectsThatWereAdded = differenceWith(newContact.projects, oldContact.projects, isSameProject)
  const projectsThatWereRemoved = differenceWith(oldContact.projects, newContact.projects, isSameProject)
  if (!isEmptyValue(projectsThatWereRemoved)) {
    handleRemoveProjects(projectsThatWereRemoved, newContact._id)
  }
  if (!isEmptyValue(projectsThatWereAdded)) {
    handleAddProjects(projectsThatWereAdded, newContact)
  }
}

const handleAddProjects = (projects, contact) => {
  const contactId = contact._id
  projects.forEach(contactProject => {
    const project = Projects.findOne(contactProject.projectId) // TODO: error handling
    const newContact = {
      contactId,
      contactName: contact.displayName,
      contactTitle: contactProject.titleForProject
    }
    let newContacts = []

    // case 1: there are no contacts on the project and project.contacts is undefined
    if (!project.contacts) {
      newContacts = [newContact]
    } else {
      const i = findIndex(project.contacts, { contactId })
      newContacts = project.contacts
      if (i < 0) {
        // case 2: this contact is not on this project but other contacts are and we're adding this contact
        newContacts.push(newContact)
      } else {
        // case 3: this contact is on this project and we're updating the info
        newContacts[i] = newContact
      }
    }

    Connectors.update(Projects, project._id, {
      $set: {
        contacts: newContacts,
        updatedAt: new Date()
      }
    })
  })
}

const handleRemoveProjects = (projects, contactId) => {
  projects.forEach(deletedProject => {
    try {
      const oldProject = Projects.findOne(deletedProject.projectId)
      const oldProjectContacts = oldProject && oldProject.contacts
      remove(oldProjectContacts, function (p) { // `remove` mutates
        return p.contactId === contactId
      })
      if (isEmptyValue(oldProjectContacts)) {
        Connectors.update(Projects, oldProject._id, {
          $set: {
            updatedAt: new Date()
          },
          $unset: {
            contacts: 1
          }
        })
      } else {
        Connectors.update(Projects, oldProject._id, {
          $set: {
            contacts: oldProjectContacts,
            updatedAt: new Date()
          }
        })
      }
    } catch {
      console.log('handleRemoveProjects could not find project', deletedProject.projectId)
      console.log('Maybe it is already a Past Project?')
    }
  })
}

const isSameProject = (a, b) => {
  return a.projectId === b.projectId
}
