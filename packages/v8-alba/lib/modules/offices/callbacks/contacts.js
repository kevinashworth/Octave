import { Connectors } from 'meteor/vulcan:core'
import _ from 'lodash'
import Contacts from '../../contacts/collection.js'
import { isEmptyValue } from '../../helpers.js'

export function OfficeEditUpdateContacts (data, { document, originalDocument }) {
  // [a] if the two `contacts` arrays are equal, do nothing
  // [b] else for deleted contacts in oldOffice but not newOffice, remove office from those contacts
  // [c] and for added contacts in newOffice but not oldOffice, add office to those contacts

  const office = document
  let contactsToRemoveThisOfficeFrom = null
  let contactsToAddThisOfficeTo = null

  if (!originalDocument) { // newly created office --> [c] add office to its contacts, if any
    if (!isEmptyValue(office.contacts)) {
      contactsToAddThisOfficeTo = office.contacts
    } else {
      return
    }
  } else {
    const newOffice = document
    const oldOffice = originalDocument
    const oldOfficeContactsLength = oldOffice.contacts ? oldOffice.contacts.length : 0
    const newOfficeContactsLength = newOffice.contacts ? newOffice.contacts.length : 0
    // [a]
    if (oldOfficeContactsLength === newOfficeContactsLength && newOfficeContactsLength === 0) {
      return
    }
    if (oldOfficeContactsLength && newOfficeContactsLength && _.isEqual(oldOffice.contacts, newOffice.contacts)) {
      return
    }
    // [b]
    contactsToRemoveThisOfficeFrom = _.difference(oldOffice.contacts, newOffice.contacts)
    // [c]
    contactsToAddThisOfficeTo = _.difference(newOffice.contacts, oldOffice.contacts)
    console.group('OfficeEditUpdateContacts:')
    console.info('OfficeEditUpdateContacts lengths:', oldOfficeContactsLength, newOfficeContactsLength)
    console.info('contactsToRemoveThisOfficeFrom:', contactsToRemoveThisOfficeFrom)
    console.info('contactsToAddThisOfficeTo:', contactsToAddThisOfficeTo)
    console.groupEnd()
  }
  // [b]
  if (contactsToRemoveThisOfficeFrom) {
    contactsToRemoveThisOfficeFrom.forEach(deletedContact => {
      const contact = Contacts.findOne(deletedContact.contactId)
      // case 1: there are no offices on the contact and contact.offices is undefined (shouldn't happen, theoretically, but it does currently anyway)
      if (contact.offices) {
        const outdatedOffices = contact.offices
        const updatedOffices = _.remove(outdatedOffices, function (o) {
          return o._id === office._id
        })
        // case 2: office didn't have the contact on it (shouldn't happen, theoretically, but does currently anyway)
        if (_.isEqual(updatedOffices, outdatedOffices)) {
          return
        }
        // case 3: update the contact with its new offices
        Connectors.update(Contacts, contact._id, {
          $set: {
            offices: updatedOffices,
            updatedAt: new Date()
          }
        })
      }
    })
  }
  // [c]
  if (contactsToAddThisOfficeTo) {
    contactsToAddThisOfficeTo.forEach(addedContact => {
      const contact = Contacts.findOne(addedContact.contactId)
      const updatedOffice = {
        officeId: office._id
      }
      let updatedOffices = []
      // case 1: office has no contacts, add contact
      if (isEmptyValue(contact.offices)) {
        updatedOffices = [updatedOffice]
      } else {
        updatedOffices = contact.offices
        const i = _.findIndex(contact.offices, { officeId: office._id })
        if (i < 0) {
          // case 2: contact not on office list of contacts, add contact
          updatedOffices.push(updatedOffice)
        } else {
          // case 3: contact is already on this office (shouldn't happen, theoretically, but it does currently anyway)
          return
        }
      }
      Connectors.update(Contacts, contact._id, {
        $set: {
          offices: updatedOffices,
          updatedAt: new Date()
        }
      })
    })
  }
}
