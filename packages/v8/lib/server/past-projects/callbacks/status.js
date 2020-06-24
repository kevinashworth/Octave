import { Connectors, createMutator, deleteMutator } from 'meteor/vulcan:core'
import _ from 'lodash'
import Contacts from '../../../modules/contacts/collection.js'
import Offices from '../../../modules/offices/collection.js'
import Projects from '../../../modules/projects/collection.js'
import PastProjects from '../../../modules/past-projects/collection.js'
import { ACTIVE_PROJECT_STATUSES_ARRAY } from '../../../modules/constants.js'
import { isEmptyValue } from '../../../modules/helpers.js'

// if the new status is now an active project, create a new project then remove this past-project
// if the new project is created and matches (TODO: matches what, exactly?), delete current

export function PastProjectEditUpdateStatusAfter (document, { context, currentUser }) {
  const newStatusIsActive = _.includes(ACTIVE_PROJECT_STATUSES_ARRAY, document.status)

  if (newStatusIsActive) {
    const { data: newProject } = Promise.await(createMutator({
      collection: Projects,
      document,
      currentUser,
      validate: false
    }))

    if (newProject.projectTitle === document.projectTitle) {
      Promise.await(deleteMutator({
        collection: PastProjects,
        documentId: document._id,
        currentUser,
        validate: false,
        context
      }))
    }

    if (document.offices && document.offices.length) {
      document.offices.forEach(officeOfDocument => {
        let pastProjects = []
        let projects = []
        const office = Offices.findOne(officeOfDocument.officeId)
        if (office.pastProjects && office.pastProjects.length) {
          pastProjects = office.pastProjects
          _.remove(pastProjects, function (p) {
            return p._id === document._id
          })
        }
        if (office.projects && office.projects.length) {
          projects = office.projects
        }
        projects.push({ projectId: newProject._id })
        Connectors.update(Offices, officeOfDocument.officeId, {
          $set: {
            pastProjects,
            projects,
            updatedAt: new Date()
          }
        })
      })
    }

    if (!isEmptyValue(document.contacts)) {
      document.contacts.forEach(c => {
        let pastProjects = []
        let projects = []
        const contact = Contacts.findOne(c.contactId)
        if (contact.pastProjects && contact.pastProjects.length) {
          pastProjects = contact.projects
          _.remove(pastProjects, function (p) {
            return p.projectId === document._id
          })
        }
        if (contact.projects && contact.projects.length) {
          projects = contact.projects
        }
        projects.push({ projectId: newProject._id })
        Connectors.update(Contacts, c.contactId, {
          $set: {
            pastProjects,
            projects,
            updatedAt: new Date()
          }
        })
      })
    }
  }
}
