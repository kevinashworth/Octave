import { Connectors, addCallback } from 'meteor/vulcan:core'
import _ from 'lodash'
import Contacts from '../contacts/collection.js'
import Projects from '../projects/collection.js'
import PastProjects from '../past-projects/collection.js'

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
    Connectors.update(Projects, project._id, { $set: { castingOfficeId: newOffice } })
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
    Connectors.update(PastProjects, project._id, { $set: { castingOfficeId: newOffice } })
  })
}

function OfficeEditUpdateContacts (data, { document, oldDocument }) {
  const newOffice = document
  const oldOffice = oldDocument

  if (_.isEqual(oldOffice.contacts, newOffice.contacts)) {
    return
  }

  const oldOfficeContactsLength = oldOffice.contacts ? oldOffice.contacts.length : 0
  const newOfficeContactsLength = newOffice.contacts ? newOffice.contacts.length : 0

  if (oldOfficeContactsLength === newOfficeContactsLength && newOfficeContactsLength === 0) {
    return
  }

  let office = null
  if (oldOfficeContactsLength > newOfficeContactsLength) {
    office = oldOffice
  } else {
    office = newOffice
  }

  office.contacts.forEach(officeContact => {
    const contact = Contacts.findOne(officeContact.contactId)
    const newOffice = {
      officeId: office._id
    }
    var newOffices = []
    // case 1:
    if (!contact.offices) {
      newOffices = [newOffice]
    } else {
      const i = _.findIndex(contact.offices, { officeId: office._id })
      newOffices = contact.offices
      if (i < 0) {
        // case 2:
        newOffices.push(newOffice)
      } else {
        // case 3:
        newOffices[i] = newOffice
      }
    }
    Connectors.update(Contacts, contact._id, { $set: { offices: newOffices } })
  })
}

addCallback('office.create.after', OfficeEditUpdateContacts)
addCallback('office.create.after', OfficeEditUpdateProjects)
addCallback('office.create.after', OfficeEditUpdatePastProjects)

addCallback('office.update.before', OfficeEditUpdateContacts)
addCallback('office.update.after', OfficeEditUpdateProjects)
addCallback('office.update.after', OfficeEditUpdatePastProjects)
