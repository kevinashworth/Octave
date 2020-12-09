import { Connectors, getSetting } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import remove from 'lodash/remove'
import log from 'loglevel'
import Contacts from '../../../modules/contacts/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

export function OfficeEditUpdateContacts (data, { document, originalDocument }) {
  // [a] if the two `contacts` arrays are equal, do nothing
  // [b] else for deleted contacts in oldOffice but not newOffice, remove office from those contacts
  // [c] and for added contacts in newOffice but not oldOffice, add office to those contacts

  const office = document
  let contactsToRemoveThisOfficeFrom = null
  let contactsToAddThisOfficeTo = null
  const newOffice = document
  const oldOffice = originalDocument
  contactsToAddThisOfficeTo = differenceWith(newOffice.contacts, oldOffice.contacts, isEqual)
  contactsToRemoveThisOfficeFrom = differenceWith(oldOffice.contacts, newOffice.contacts, isEqual)
  log.debug('OfficeEditUpdateContacts:')
  log.debug('contactsToRemoveThisOfficeFrom:', contactsToRemoveThisOfficeFrom)
  log.debug('contactsToAddThisOfficeTo:', contactsToAddThisOfficeTo)
  // [b]
  if (contactsToRemoveThisOfficeFrom) {
    contactsToRemoveThisOfficeFrom.forEach(deletedContact => {
      const contact = Contacts.findOne(deletedContact.contactId)
      // case 1: there are no offices on the contact and contact.offices is undefined (shouldn't happen, theoretically, but it does currently anyway)
      if (contact.offices) {
        const outdatedOffices = contact.offices
        const updatedOffices = remove(outdatedOffices, function (o) {
          return o._id === office._id
        })
        // case 2: office didn't have the contact on it (shouldn't happen, theoretically, but does currently anyway)
        if (isEqual(updatedOffices, outdatedOffices)) {
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
        const i = findIndex(contact.offices, { officeId: office._id })
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

export function OfficeCreateUpdateContacts (document) {
  const office = document
  const contactsToAddThisOfficeTo = document.contacts

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
        const i = findIndex(contact.offices, { officeId: office._id })
        if (i < 0) {
          // case 2: contact not on office list of contacts, add contact
          updatedOffices.push(updatedOffice)
        } else {
          // case 3: contact is already on this office (shouldn't happen, theoretically, but it does currently anyway)
          return
        }
      }
      const setObj = {
        offices: updatedOffices
      }
      if (!getSetting('mockaroo.seedDatabase')) {
        setObj.updatedAt = new Date()
      }
      Connectors.update(Contacts, contact._id, {
        $set: setObj
      })
    })
  }
}
