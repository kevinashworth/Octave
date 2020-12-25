import { Connectors } from 'meteor/vulcan:core'
import Contacts from '../../../modules/contacts/collection.js'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import remove from 'lodash/remove'
import log from 'loglevel'
import { isEmptyValue } from '../../../modules/helpers.js'

// callbacks.create.async
export const createProjectUpdateContacts = ({ document }) => {
  const project = document
  if (!isEmptyValue(project.contacts)) {
    handleAddContacts(project.contacts, project)
  }
}

// callbacks.udpate.async
export const updateProjectUpdateContacts = ({ document, originalDocument }) => {
  const newProject = document
  const oldProject = originalDocument
  const contactsThatWereAdded = differenceWith(newProject.contacts, oldProject.contacts, isSameContactById)
  const contactsThatWereRemoved = differenceWith(oldProject.contacts, newProject.contacts, isSameContactById)
  const contactsThatWereUpdated = differenceWith(newProject.contacts, oldProject.contacts, isUpdatedContact)
  log.debug('updateProjectUpdateContacts:')
  log.debug('contactsThatWereRemoved:', contactsThatWereRemoved)
  log.debug('contactsThatWereAdded:', contactsThatWereAdded)
  log.debug('contactsThatWereUpdated:', contactsThatWereUpdated)
  if (!isEmptyValue(contactsThatWereRemoved)) {
    handleRemoveContacts(contactsThatWereRemoved, newProject._id)
  }
  if (!isEmptyValue(contactsThatWereAdded)) {
    handleAddContacts(contactsThatWereAdded, newProject)
  }
  if (!isEmptyValue(contactsThatWereUpdated)) {
    handleUpdateContacts(contactsThatWereUpdated, newProject)
  }
}

const handleAddContacts = (contacts, project) => {
  const projectId = project._id
  contacts.forEach(addedContact => {
    const contact = Contacts.findOne(addedContact.contactId)
    const updatedProject = {
      projectId,
      projectTitle: project.projectTitle,
      titleForProject: addedContact.contactTitle
    }
    let updatedProjects = []
    // case 1: nothing there
    if (isEmptyValue(contact.projects)) {
      updatedProjects = [updatedProject]
    } else {
      updatedProjects = contact.projects
      const i = findIndex(contact.projects, { projectId })
      if (i < 0) {
        // case 2: add to it
        updatedProjects.push(updatedProject)
      } else {
        // case 3: already there
        return
      }
    }
    Connectors.update(Contacts, contact._id, {
      $set: {
        projects: updatedProjects,
        updatedAt: new Date()
      }
    })
  })
}

const handleRemoveContacts = (contacts, projectId) => {
  contacts.forEach(deletedContact => {
    const oldContact = Contacts.findOne(deletedContact.contactId)
    if (oldContact) {
      const oldContactProjects = oldContact.projects
      remove(oldContactProjects, function (p) { // `remove` mutates
        return p.projectId === projectId
      })
      if (isEmptyValue(oldContactProjects)) {
        Connectors.update(Contacts, oldContact._id, {
          $set: {
            updatedAt: new Date()
          },
          $unset: {
            projects: 1
          }
        })
      } else {
        Connectors.update(Contacts, oldContact._id, {
          $set: {
            projects: oldContactProjects,
            updatedAt: new Date()
          }
        })
      }
    }
  })
}

const handleUpdateContacts = (contacts, project) => {
  const projectId = project._id
  contacts.forEach(updatedContact => {
    const contact = Contacts.findOne(updatedContact.contactId)
    console.log('contact title possibles.')
    console.log('project.contacts:', project.contacts)
    console.log('updatedContact?.contactTitle:', updatedContact?.contactTitle)
    const updatedProject = {
      projectId,
      projectTitle: project.projectTitle,
      titleForProject: updatedContact?.contactTitle
    }
    let updatedProjects = []
    // case 1: nothing there
    if (isEmptyValue(contact.projects)) {
      updatedProjects = [updatedProject]
    } else {
      updatedProjects = contact.projects
      const i = findIndex(contact.projects, { projectId })
      if (i < 0) {
        // case 2: add to it
        updatedProjects.push(updatedProject)
      } else {
        // case 3: it is there and needs to be updated <-- different from Add function!
        updatedProjects[i] = updatedProject
      }
    }
    Connectors.update(Contacts, contact._id, {
      $set: {
        projects: updatedProjects,
        updatedAt: new Date()
      }
    })
  })
}

const isSameContactById = (a, b) => {
  return a.contactId === b.contactId
}

const isUpdatedContact = (a, b) => {
  if (isSameContactById) {
    const result = isEqual(a, b)
    return result
  } else {
    return false
  }
}
