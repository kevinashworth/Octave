import { Connectors } from 'meteor/vulcan:core'
import findIndex from 'lodash/findIndex'
import includes from 'lodash/includes'
import sortBy from 'lodash/sortBy'
import Contacts from '../../../modules/contacts/collection.js'
import { ACTIVE_PROJECT_STATUSES_ARRAY } from '../../../modules/constants.js'
import { isEmptyValue } from '../../../modules/helpers.js'

/*
When updating a contact on a pastproject, also update that contact with the pastproject.
I get confused, so here's a description:

Where i represents the contact(s) we're adding to our pastproject,
pastproject.contacts[i] has { contactId, contactName, contactTitle }

But we actually get all contacts, not just i, the new ones.

So for each of the pastproject.contacts we update contact.pastprojects of the Contact with _id === contactId with
{
  projectId: project._id,
  projectTitle: project.projectTitle,
  titleForProject: projectContact.contactTitle
}
*/

export function PastProjectEditUpdateContacts (document, properties) {
  const project = document
  if (!project.contacts) {
    return
  }

  project.contacts.forEach(projectContact => {
    const contact = Contacts.findOne(projectContact.contactId) // TODO: error handling
    const newProject = {
      projectId: project._id,
      projectTitle: project.projectTitle,
      titleForProject: projectContact.contactTitle
    }

    if (includes(ACTIVE_PROJECT_STATUSES_ARRAY, project.status)) {
      // past-project is becoming a project
      var newProjects = []
      // case 1: there are no contacts on the project and project.contacts is undefined
      if (!contact.projects) {
        newProjects = [newProject]
      } else {
        const i = findIndex(contact.projects, { projectId: project._id })
        newProjects = contact.projects
        if (i < 0) {
          // case 2: this contact is not on this project but other contacts are and we're adding this contact
          newProjects.push(newProject)
        } else {
          // case 3: this contact is on this project and we're updating the info
          newProjects[i] = newProject
        }
      }
      const sortedProjects = sortBy(newProjects, ['projectTitle'])
      Connectors.update(Contacts, contact._id, {
        $set: {
          projects: sortedProjects,
          updatedAt: new Date()
        }
      })

      // also remove the past-project from contact.pastProjects
      if (!isEmptyValue(contact.pastProjects)) {
        var newPastProjects = contact.pastProjects
        const i = findIndex(contact.pastProjects, { projectId: project._id })
        if (i > -1) {
          newPastProjects.splice(i, 1)
          Connectors.update(Contacts, contact._id, {
            $set: {
              pastProjects: newPastProjects,
              updatedAt: new Date()
            }
          })
        }
      }
    } else {
      // past-project remains a past-project
      newPastProjects = []
      // case 1: there are no past-projects on the contact and contact.pastProjects is undefined
      if (isEmptyValue(contact.pastProjects)) {
        newPastProjects = [newProject]
      } else {
        const i = findIndex(contact.pastProjects, { projectId: project._id })
        newPastProjects = contact.pastProjects
        if (i < 0) {
          // case 2: this past-project is not on this contact but other past-projects are and we're adding this past-project
          newPastProjects.push(newProject)
        } else {
          // case 3: this past-project is on this contact and we're updating the info
          newPastProjects[i] = newProject
        }
      }
      Connectors.update(Contacts, contact._id, {
        $set: {
          pastProjects: newPastProjects,
          updatedAt: new Date()
        }
      })
    }
  })
}
