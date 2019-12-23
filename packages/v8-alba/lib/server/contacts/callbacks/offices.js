import { Connectors } from 'meteor/vulcan:core'
import _ from 'lodash'
import Offices from '../../offices/collection.js'
import { getFullNameFromContact } from '../../helpers.js'

/*
When updating an office on a contact, also update that office with the contact.
I get confused, so here's a description:

  Where i represents the office(s) we're adding to our contact,
  contact.offices[i] has { officeId, officeName }

  But we actually get all offices, not just i, the new ones.

  So for each of the contact.offices we update office.contacts of the Office with _id === officeId with
  {
    contactId: contact._id,
    contactName: fullName -- which is getFullNameFromContact(contact)
  }

TODO: What about the contact's title for this office?
*/

export function ContactCreateUpdateOffices (document, properties) {
  console.log('just entered ContactCreateUpdateOffices'); // eslint-disable-line no-console
  const contact = document
  if (!contact.offices) {
    return
  }
  const fullName = getFullNameFromContact(contact)

  contact.offices.forEach(contactOffice => {
    const office = Offices.findOne(contactOffice.officeId) // TODO: error handling
    const newContact = {
      contactId: contact._id,
      contactName: fullName
    }
    let newContacts = []

    // case 1: there are no contacts on the office and office.contacts is undefined
    if (!office.contacts) {
      newContacts = [newContact]
    } else {
      const i = _.findIndex(office.contacts, { contactId: contact._id })
      newContacts = office.contacts
      if (i < 0) {
        // case 2: this contact is not on this office but other contacts are and we're adding this contact
        newContacts.push(newContact)
      } else {
        // case 3: this contact is on this office and we're updating the info
        newContacts[i] = newContact
      }
    }

    Connectors.update(Offices, office._id, {
      $set: {
        contacts: newContacts,
        updatedAt: new Date()
      }
    })
  })
  console.log('now leaving ContactCreateUpdateOffices'); // eslint-disable-line no-console
  return document
}

export function ContactEditUpdateOffices (document, properties) {
  console.log('just entered ContactEditUpdateOffices'); // eslint-disable-line no-console
  const contact = document
  if (!contact.offices) {
    return
  }
  const fullName = getFullNameFromContact(contact)

  contact.offices.forEach(contactOffice => {
    const office = Offices.findOne(contactOffice.officeId) // TODO: error handling
    const newContact = {
      contactId: contact._id,
      contactName: fullName
    }
    let newContacts = []

    // case 1: there are no contacts on the office and office.contacts is undefined
    if (!office.contacts) {
      newContacts = [newContact]
    } else {
      const i = _.findIndex(office.contacts, { contactId: contact._id })
      newContacts = office.contacts
      if (i < 0) {
        // case 2: this contact is not on this office but other contacts are and we're adding this contact
        newContacts.push(newContact)
      } else {
        // case 3: this contact is on this office and we're updating the info
        newContacts[i] = newContact
      }
    }

    Connectors.update(Offices, office._id, {
      $set: {
        contacts: newContacts,
        updatedAt: new Date()
      }
    })
  })
  console.log('now leaving ContactEditUpdateOffices'); // eslint-disable-line no-console
  return document
}
