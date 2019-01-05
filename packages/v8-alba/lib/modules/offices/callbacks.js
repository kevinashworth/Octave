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

So for each of the office.projects we update project.castingOffice of the Project with _id === projectId with
{
  officeId: office._id
}

TODO: For some reason, the project's `updatedAt` field doesn't get a `new Date()` `onEdit`
*/
function OfficeEditUpdateProjects (office) {
  if (!office.projects) {
    return
  }

  office.projects.forEach(officeProject => {
    const project = Projects.findOne(officeProject.projectId) // TODO: error handling
    const newOffice = office._id
    Connectors.update(Projects, project._id, { $set: { castingOffice: newOffice } })
  })
}

function OfficeEditUpdatePastProjects (office) {
  if (!office.pastProjects) {
    return
  }

  office.pastProjects.forEach(officeProject => {
    const project = PastProjects.findOne(officeProject.projectId) // TODO: error handling
    const newOffice = office._id
    Connectors.update(PastProjects, project._id, { $set: { castingOffice: newOffice } })
  })
}

function OfficeEditUpdateContacts (data, { document, newDocument }) {
  console.group()
  console.log('Hello from OfficeEditUpdateContacts')

  const oldOffice = document
  const newOffice = newDocument

  if (_.isEqual(oldOffice.contacts, newOffice.contacts)) {
    console.log('No change in contacts')
    return
  }

  var office = null

  if (oldOffice.contacts.length > newOffice.contacts.length) {
    office = oldOffice
    console.log('Using oldOffice contacts')
  } else {
    office = newOffice
    console.log('Using newOffice contacts')
  }

  if (!office.contacts) {
    console.log('No contacts')
    return
  }

  office.contacts.forEach(officeContact => {
    const contact = Contacts.findOne(officeContact.contactId)
    console.log('1 contact:', contact)
    const newOffice = {
      officeId: office._id
    }
    console.log('2 newOffice:', newOffice)
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
    console.log('3 newOffices:', newOffices)
    Connectors.update(Contacts, contact._id, { $set: { offices: newOffices } })
  })
  console.log('Goodbye from OfficeEditUpdateContacts')
  console.groupEnd()
}

addCallback('office.create.after', OfficeEditUpdateProjects)
addCallback('office.create.after', OfficeEditUpdatePastProjects)
addCallback('office.update.after', OfficeEditUpdateProjects)
addCallback('office.update.after', OfficeEditUpdatePastProjects)
addCallback('office.update.before', OfficeEditUpdateContacts)
