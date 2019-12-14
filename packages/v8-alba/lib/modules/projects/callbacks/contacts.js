import { Connectors } from 'meteor/vulcan:core'
import Contacts from '../../contacts/collection.js'
import _ from 'lodash'
// import { PAST_PROJECT_STATUSES_ARRAY } from '../../constants.js'
import { isEmptyValue } from '../../helpers.js'

/*
When updating a contact on a project, also update that contact with the project.
I get confused, so here's a description:

Where i represents the contact(s) we're adding to our project,
project.contacts[i] has { contactId, contactName, contactTitle }

But we actually get all contacts, not just i, the new ones.

So for each of the project.contacts we update contact.projects of the Contact with _id === contactId with
{
  projectId: project._id,
  projectTitle: project.projectTitle,
  titleForProject: [whereeverwecanfindit].contactTitle
}
*/

export function ProjectEditUpdateContacts (data, { document, originalDocument }) {
  // [a] if the two `contacts` arrays are equal, do nothing
  // [b] else for deleted contacts in oldProject but not newProject, remove project from those contacts
  // [c] and for added contacts in newProject but not oldProject, add project to those contacts

  // TODO: what happens when Project becomes PastProject ???

  const project = document
  let contactsToRemoveThisProjectFrom = null
  let contactsToAddThisProjectTo = null

  if (!originalDocument) { // newly created project --> [c] add project to its contacts, if any
    if (!isEmptyValue(project.contacts)) {
      contactsToAddThisProjectTo = project.contacts
    } else {
      return
    }
  } else {
    const newProject = document
    const oldProject = originalDocument
    contactsToAddThisProjectTo = _.differenceWith(newProject.contacts, oldProject.contacts, _.isEqual)
    contactsToRemoveThisProjectFrom = _.differenceWith(oldProject.contacts, newProject.contacts, _.isEqual)
    console.group('ProjectEditUpdateContacts:')
    console.info('contactsToRemoveThisProjectFrom:', contactsToRemoveThisProjectFrom)
    console.info('contactsToAddThisProjectTo:', contactsToAddThisProjectTo)
    console.groupEnd()
  }
  // [b]
  if (contactsToRemoveThisProjectFrom) {
    contactsToRemoveThisProjectFrom.forEach(deletedContact => {
      const oldContact = Contacts.findOne(deletedContact.contactId)
      let oldContactProjects = oldContact && oldContact.projects

      _.remove(oldContactProjects, function (p) {
        return p.projectId === document._id
      })

      if (isEmptyValue(oldContactProjects)) {
        Connectors.update(Contacts, oldContact._id, {
          $unset: {
            projects: 1
          }
        })
      } else {
        Connectors.update(Contacts, oldContact._id, {
          $set: {
            projects: oldContactProjects,
            updatedAt: new Date()
          }
        })
      }
    })
  }

  // [c]
  if (contactsToAddThisProjectTo) {
    contactsToAddThisProjectTo.forEach(addedContact => {
      const contact = Contacts.findOne(addedContact.contactId)
      const updatedProject = {
        projectId: project._id,
        projectTitle: project.projectTitle,
        titleForProject: addedContact.contactTitle
      }
      let updatedProjects = []
      // case 1: nothing there
      if (isEmptyValue(contact.projects)) {
        updatedProjects = [updatedProject]
      } else {
        updatedProjects = contact.projects
        const i = _.findIndex(contact.projects, { projectId: project._id })
        if (i < 0) {
          // case 2: add to it
          updatedProjects.push(updatedProject)
        } else {
          // case 3: already there
          return
        }
      }
      Connectors.update(Contacts, contact._id, {
        $set: {
          projects: updatedProjects,
          updatedAt: new Date()
        }
      })
    })
  }
}
