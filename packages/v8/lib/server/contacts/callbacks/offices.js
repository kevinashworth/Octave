import { Connectors } from 'meteor/vulcan:core'
import differenceWith from 'lodash/differenceWith'
import findIndex from 'lodash/findIndex'
import remove from 'lodash/remove'
import Offices from '../../../modules/offices/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

// callbacks.update.before
// for unknown reasons, officeName is sometimes missing
export const updateOfficeNames = (data) => {
  if (isEmptyValue(data.offices)) {
    return data
  }
  data.offices.map(office => {
    if (isEmptyValue(office.officeName)) {
      const getOffice = Offices.findOne(office.officeId)
      office.officeName = getOffice.displayName
    }
    return office
  })
  return data
}

// callbacks.create.async
export const createContactUpdateOffices = ({ document }) => {
  const contact = document
  if (!isEmptyValue(contact.offices)) {
    handleAddOffices(contact.offices, contact)
  }
}

// callbacks.udpate.async
export const updateContactUpdateOffices = ({ document, originalDocument }) => {
  const newContact = document
  const oldContact = originalDocument
  const officesThatWereAdded = differenceWith(newContact.offices, oldContact.offices, isSameOffice)
  const officesThatWereRemoved = differenceWith(oldContact.offices, newContact.offices, isSameOffice)
  if (!isEmptyValue(officesThatWereRemoved)) {
    handleRemoveOffices(officesThatWereRemoved, newContact._id)
  }
  if (!isEmptyValue(officesThatWereAdded)) {
    handleAddOffices(officesThatWereAdded, newContact)
  }
}

const handleAddOffices = (offices, contact) => {
  const contactId = contact._id
  offices.forEach(contactOffice => {
    const office = Offices.findOne(contactOffice.officeId)
    if (office) {
      const newContact = {
        contactId,
        contactName: contact.displayName
      }
      let newContacts = []

      // case 1: there are no contacts on the office and office.contacts is undefined
      if (!office.contacts) {
        newContacts = [newContact]
      } else {
        const i = findIndex(office.contacts, { contactId })
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
    }
  })
}

const handleRemoveOffices = (offices, contactId) => {
  offices.forEach(deletedOffice => {
    const oldOffice = Offices.findOne(deletedOffice.officeId)
    if (oldOffice) {
      const oldOfficeContacts = oldOffice.contacts
      remove(oldOfficeContacts, function (p) { // `remove` mutates
        return p.contactId === contactId
      })
      if (isEmptyValue(oldOfficeContacts)) {
        Connectors.update(Offices, oldOffice._id, {
          $set: {
            updatedAt: new Date()
          },
          $unset: {
            contacts: 1
          }
        })
      } else {
        Connectors.update(Offices, oldOffice._id, {
          $set: {
            contacts: oldOfficeContacts,
            updatedAt: new Date()
          }
        })
      }
    }
  })
}

const isSameOffice = (a, b) => {
  return a.officeId === b.officeId
}
