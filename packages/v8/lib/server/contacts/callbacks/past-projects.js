import { Connectors } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import remove from 'lodash/remove'
import PastProjects from '../../../modules/past-projects/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

// callbacks.update.before
// for unknown reasons, projectTitle is sometimes missing
export const updatePastProjectTitles = (data) => {
  if (isEmptyValue(data.pastProjects)) {
    return data
  }
  data.pastProjects.map(pastProject => {
    if (isEmptyValue(pastProject.projectTitle)) {
      const getPastProject = PastProjects.findOne(pastProject.projectId)
      pastProject.projectTitle = getPastProject.projectTitle
    }
    return pastProject
  })
  return data
}

// callbacks.create.async
export const createContactUpdatePastProjects = ({ document }) => {
  const contact = document
  if (!isEmptyValue(contact.pastProjects)) {
    handleAddPastProjects(contact.pastProjects, contact)
  }
}

// callbacks.udpate.async
export const updateContactUpdatePastProjects = ({ document, originalDocument }) => {
  const newContact = document
  const oldContact = originalDocument
  const pastProjectsThatWereAdded = differenceWith(newContact.pastProjects, oldContact.pastProjects, isSamePastProject)
  const pastProjectsThatWereRemoved = differenceWith(oldContact.pastProjects, newContact.pastProjects, isSamePastProject)
  if (!isEmptyValue(pastProjectsThatWereRemoved)) {
    handleRemovePastProjects(pastProjectsThatWereRemoved, newContact._id)
  }
  if (!isEmptyValue(pastProjectsThatWereAdded)) {
    handleAddPastProjects(pastProjectsThatWereAdded, newContact)
  }
}

const handleAddPastProjects = (pastProjects, contact) => {
  const contactId = contact._id
  pastProjects.forEach(contactPastProject => {
    const pastProject = PastProjects.findOne(contactPastProject.projectId) // TODO: error handling
    const newContact = {
      contactId,
      contactName: contact.displayName,
      contactTitle: contactPastProject.titleForProject
    }
    let newContacts = []

    // case 1: there are no contacts on the pastProject and pastProject.contacts is undefined
    if (!pastProject.contacts) {
      newContacts = [newContact]
    } else {
      const i = findIndex(pastProject.contacts, { contactId })
      newContacts = pastProject.contacts
      if (i < 0) {
        // case 2: this contact is not on this pastProject but other contacts are and we're adding this contact
        newContacts.push(newContact)
      } else {
        // case 3: this contact is on this pastProject and we're updating the info
        newContacts[i] = newContact
      }
    }

    Connectors.update(PastProjects, pastProject._id, {
      $set: {
        contacts: newContacts,
        updatedAt: new Date()
      }
    })
  })
}

const handleRemovePastProjects = (pastProjects, contactId) => {
  pastProjects.forEach(deletedPastProject => {
    const oldPastProject = PastProjects.findOne(deletedPastProject.projectId)
    const oldPastProjectContacts = oldPastProject && oldPastProject.contacts
    remove(oldPastProjectContacts, function (p) { // `remove` mutates
      return p.contactId === contactId
    })
    if (isEmptyValue(oldPastProjectContacts)) {
      Connectors.update(PastProjects, oldPastProject._id, {
        $set: {
          updatedAt: new Date()
        },
        $unset: {
          contacts: 1
        }
      })
    } else {
      Connectors.update(PastProjects, oldPastProject._id, {
        $set: {
          contacts: oldPastProjectContacts,
          updatedAt: new Date()
        }
      })
    }
  })
}

const isSamePastProject = (a, b) => {
  return a.projectId === b.projectId
}
