import { Connectors, addCallback } from 'meteor/vulcan:core'
import _ from 'lodash'
import Contacts from '../contacts/collection.js'
import Projects from '../projects/collection.js'
import PastProjects from '../past-projects/collection.js'
import { isEmptyValue } from '../helpers.js'


/*
When updating a project on an office, also update that project with the office.
I get confused, so here's a description:

Where i represents the project(s) we're adding to our office,
office.projects[i] has { projectId }

But we actually get all projects, not just i, the new ones.

So for each of the office.projects we update project.castingOfficeId of the Project with _id === projectId with
{
  officeId: office._id
}

TODO: For some reason, the project's `updatedAt` field doesn't get a `new Date()` `onEdit`
*/
function OfficeEditUpdateProjects (data, { document }) {
  const office = document
  if (!office.projects) {
    return
  }

  office.projects.forEach(officeProject => {
    const project = Projects.findOne(officeProject.projectId) // TODO: error handling
    const newOffice = office._id
    Connectors.update(Projects, project._id, { $set: {
      castingOfficeId: newOffice,
      updatedAt: new Date()
    } })
  })
}

function OfficeEditUpdatePastProjects (data, { document }) {
  const office = document
  if (!office.pastProjects) {
    return
  }

  office.pastProjects.forEach(officeProject => {
    const project = PastProjects.findOne(officeProject.projectId) // TODO: error handling
    const newOffice = office._id
    Connectors.update(PastProjects, project._id, { $set: {
      castingOfficeId: newOffice,
      updatedAt: new Date()
    } })
  })
}

function OfficeEditUpdateContacts (data, { document, oldDocument }) {
  // [a] if the two `contacts` arrays are equal, do nothing
  // [b] else for deleted contacts in oldOffice but not newOffice, remove office from those contacts
  // [c] and for added contacts in newOffice but not oldOffice, add office to those contacts

  let office = document
  let contactsToRemoveThisOfficeFrom = null
  let contactsToAddThisOfficeTo = null

  if (!oldDocument) { // newly created office --> [c] add office to its contacts, if any
    if (!isEmptyValue(office.contacts)) {
      contactsToAddThisOfficeTo = office.contacts
    } else {
      return
    }
  } else {
    const newOffice = document
    const oldOffice = oldDocument
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
    console.info('OfficeEditUpdateContacts:', oldOfficeContactsLength, newOfficeContactsLength);
    console.info('contactsToRemoveThisOfficeFrom:', contactsToRemoveThisOfficeFrom)
    console.info('contactsToAddThisOfficeTo:', contactsToAddThisOfficeTo)
  }
  // [b]
  if (contactsToRemoveThisOfficeFrom) {
    contactsToRemoveThisOfficeFrom.forEach(deletedContact => {
      const contact = Contacts.findOne(deletedContact.contactId)
      // case 1: there are no offices on the contact and contact.offices is undefined (shouldn't happen, theoretically, but it does currently anyway)
      if (!contact.offices) {
        return
      } else {
        const outdatedOffices = contact.offices
        const updatedOffices = _.remove(outdatedOffices, function(o) {
          return o._id === office._id
        })
        //case 2: the office didn't have the contact on it (shouldn't happen, theoretically, but it does currently anyway)
        if (_.isEqual(updatedOffices, outdatedOffices)) {
          return
        }
        // case 3: update the contact with its new offices
        Connectors.update(Contacts, contact._id, { $set: {
          offices: updatedOffices,
          updatedAt: new Date()
        } })
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
      Connectors.update(Contacts, contact._id, { $set: {
        offices: updatedOffices,
        updatedAt: new Date()
      } })
    })
  }
}

addCallback('office.create.after', OfficeEditUpdateContacts)
addCallback('office.create.after', OfficeEditUpdateProjects)
addCallback('office.create.after', OfficeEditUpdatePastProjects)

addCallback('office.update.before', OfficeEditUpdateContacts)
addCallback('office.update.after', OfficeEditUpdateProjects)
addCallback('office.update.after', OfficeEditUpdatePastProjects)
