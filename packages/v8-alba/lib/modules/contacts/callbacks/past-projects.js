import { Connectors, } from 'meteor/vulcan:core'
import _ from 'lodash'
import PastProjects from '../../past-projects/collection.js'
import { getFullNameFromContact } from '../../helpers.js'

/*
When updating a past-project on a contact, also update that past-project with the contact.
I get confused, so here's a description:

  Where i represents the project(s) we're adding to our contact,
  contact.pastProjects[i] has { projectId, projectTitle, titleForProject }

  But we actually get all pastProjects, not just i, the new ones.

  So for each of the contact.pastProjects we update project.contacts of the Project with _id === projectId with
  {
    contactId: contact._id,
    contactName: fullName -- which is getFullNameFromContact(contact),
    contactTitle: project.titleForProject
  }
*/

export function ContactEditUpdatePastProjects (document, properties) {
  const contact = document
  if (!contact.pastProjects) {
    return
  }
  const fullName = getFullNameFromContact(contact)

  contact.pastProjects.forEach(contactProject => {
    const pastProject = PastProjects.findOne(contactProject.projectId) // TODO: error handling
    const newContact = {
      contactId: contact._id,
      contactName: fullName,
      contactTitle: contactProject.titleForProject
    }
    let newContacts = []

    // case 1: there are no contacts on the project and project.contacts is undefined
    if (!pastProject.contacts) {
      newContacts = [newContact]
    } else {
      const i = _.findIndex(pastProject.contacts, { contactId: contact._id })
      newContacts = pastProject.contacts
      if (i < 0) {
        // case 2: this contact is not on this project but other contacts are and we're adding this contact
        newContacts.push(newContact)
      } else {
        // case 3: this contact is on this project and we're updating the info
        newContacts[i] = newContact
      }
    }
    Connectors.update(PastProjects, pastProject._id, { $set: {
      contacts: newContacts,
      updatedAt: new Date()
    } })
  })
}
