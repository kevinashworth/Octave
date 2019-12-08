import { Connectors } from 'meteor/vulcan:core'
import Contacts from '../../contacts/collection.js'
import _ from 'lodash'
import { PAST_PROJECT_STATUSES_ARRAY } from '../../constants.js'
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
  titleForProject: projectContact.contactTitle
}
*/

export function ProjectEditUpdateContacts (data, { document }) {
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

    if (_.includes(PAST_PROJECT_STATUSES_ARRAY, project.status)) {
      // project is becoming a past-project
      var newPastProjects = []
      // case 1: there are no pastProjects on the contact and contact.pastProjects is undefined
      if (!contact.pastProjects) {
        newPastProjects = [newProject]
      } else {
        const i = _.findIndex(contact.pastProjects, { projectId: project._id })
        newPastProjects = contact.pastProjects
        if (i < 0) {
          // case 2: this past-project is not on this contact but other past-projects are and we're adding this past-project
          newPastProjects.push(newProject)
        } else {
          // case 3: this past-project is on this contact and we're updating the info
          newPastProjects[i] = newProject
        }
      }
      const sortedPastProjects = _.sortBy(newPastProjects, ['projectTitle'])
      Connectors.update(Contacts, contact._id, { $set: {
        pastProjects: sortedPastProjects,
        updatedAt: new Date()
      } })

      // also remove the project from contact.projects
      if (!isEmptyValue(contact.projects)) {
        var newProjects = contact.projects
        const i = _.findIndex(contact.projects, { projectId: project._id })
        if (i > -1) {
          newProjects.splice(i, 1)
          Connectors.update(Contacts, contact._id, { $set: {
            projects: newProjects,
            updatedAt: new Date()
          } })
        }
      }
    } else {
      // project remains a project
      newProjects = []
      // case 1: there are no projects on the contact and contact.projects is undefined
      if (isEmptyValue(contact.projects)) {
        newProjects = [newProject]
      } else {
        const i = _.findIndex(contact.projects, { projectId: project._id })
        newProjects = contact.projects
        if (i < 0) {
          // case 2: this project is not on this contact but other projects are and we're adding this project
          newProjects.push(newProject)
        } else {
          // case 3: this project is on this contact and we're updating the info
          newProjects[i] = newProject
        }
      }
      Connectors.update(Contacts, contact._id, { $set: {
        projects: newProjects,
        updatedAt: new Date()
      } })
    }
  })
}
