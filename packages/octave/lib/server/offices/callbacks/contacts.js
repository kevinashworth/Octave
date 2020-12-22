import { Connectors } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import remove from 'lodash/remove'
import Contacts from '../../../modules/contacts/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

const handleAddContacts = (contacts, office) => {
  const officeId = office._id
  contacts.forEach(officeContact => {
    const contact = Contacts.findOne(officeContact.contactId)
    if (contact) {
      const newOffice = {
        officeId,
        officeName: office.displayName
      }
      let newOffices = []

      // case 1: there are no offices on the contact and contact.offices is undefined
      if (!contact.offices) {
        newOffices = [newOffice]
      } else {
        const i = findIndex(contact.offices, { officeId })
        newOffices = contact.offices
        if (i < 0) {
          // case 2: this office is not on this contact but other offices are and we're adding this office
          newOffices.push(newOffice)
        } else {
          // case 3: this office is on this contact and we're updating the info TODO: is this redundant?
          newOffices[i] = newOffice
        }
      }

      Connectors.update(Contacts, contact._id, {
        $set: {
          offices: newOffices,
          updatedAt: new Date()
        }
      })
    }
  })
}

const handleRemoveContacts = (contacts, officeId) => {
  contacts.forEach(deletedContact => {
    const oldContact = Contacts.findOne(deletedContact.contactId)
    if (oldContact) {
      const oldContactOffices = oldContact.offices
      remove(oldContactOffices, function (p) { // `remove` mutates
        return p.officeId === officeId
      })
      if (isEmptyValue(oldContactOffices)) {
        Connectors.update(Contacts, oldContact._id, {
          $set: {
            updatedAt: new Date()
          },
          $unset: {
            offices: 1
          }
        })
      } else {
        Connectors.update(Contacts, oldContact._id, {
          $set: {
            offices: oldContactOffices,
            updatedAt: new Date()
          }
        })
      }
    }
  })
}

const isSameContact = (a, b) => {
  return a.contactId === b.contactId
}

// callbacks.create.async
export const createOfficeUpdateContacts = ({ document }) => {
  const office = document
  if (!isEmptyValue(office.contacts)) {
    handleAddContacts(office.contacts, office)
  }
}

// callbacks.update.async
export const updateOfficeUpdateContacts = ({ document, originalDocument }) => {
  const newOffice = document
  const oldOffice = originalDocument
  const contactsThatWereAdded = differenceWith(newOffice.contacts, oldOffice.contacts, isSameContact)
  const contactsThatWereRemoved = differenceWith(oldOffice.contacts, newOffice.contacts, isSameContact)
  if (!isEmptyValue(contactsThatWereRemoved)) {
    handleRemoveContacts(contactsThatWereRemoved, newOffice._id)
  }
  if (!isEmptyValue(contactsThatWereAdded)) {
    handleAddContacts(contactsThatWereAdded, newOffice)
  }
}
