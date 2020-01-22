import { Connectors, createMutator, deleteMutator } from 'meteor/vulcan:core'
import _ from 'lodash'
import Contacts from '../../../modules/contacts/collection.js'
import Offices from '../../../modules/offices/collection.js'
import Projects from '../../../modules/projects/collection.js'
import PastProjects from '../../../modules/past-projects/collection.js'
import { PAST_PROJECT_STATUSES_ARRAY } from '../../../modules/constants.js'
import { isEmptyValue } from '../../../modules/helpers.js'

// if the new status is now a past-project, create a new past-project then remove this active project
// if the new project is created and matches (TODO: matches what, exactly?), delete current

export function ProjectEditUpdateStatusAfter (document, { context, currentUser }) {
  const newStatusIsPast = _.includes(PAST_PROJECT_STATUSES_ARRAY, document.status)

  if (newStatusIsPast) {
    const { data: newPastProject } = Promise.await(createMutator({
      collection: PastProjects,
      document,
      currentUser,
      validate: false
    }))

    if (newPastProject.projectTitle === document.projectTitle) {
      Promise.await(deleteMutator({
        collection: Projects,
        documentId: document._id,
        currentUser,
        validate: false,
        context
      }))
    }

    if (document.castingOfficeId) {
      let pastProjects = []
      let projects = []
      const office = Offices.findOne(document.castingOfficeId)
      if (office.projects && office.projects.length) {
        projects = office.projects
        _.remove(projects, function (p) {
          return p.projectId === document._id
        })
      }
      if (office.pastProjects && office.pastProjects.length) {
        pastProjects = office.pastProjects
      }
      pastProjects.push({ projectId: newPastProject._id })
      Connectors.update(Offices, document.castingOfficeId, {
        $set: {
          pastProjects,
          projects,
          updatedAt: new Date()
        }
      })
    }

    if (!isEmptyValue(document.contacts)) {
      document.contacts.forEach(cntct => {
        // let pastProjects = []
        let projects = []
        const contact = Contacts.findOne(cntct.contactId)
        if (contact.projects && contact.projects.length) {
          projects = contact.projects
          _.remove(projects, function (p) {
            return p.projectId === document._id
          })
        }
        // this is done in the callback for past project create
        // if (contact.pastProjects && contact.pastProjects.length) {
        //   pastProjects = contact.pastProjects
        // }
        // pastProjects.push({ projectId: newPastProject._id })
        Connectors.update(Contacts, cntct.contactId, {
          $set: {
            // pastProjects,
            projects,
            updatedAt: new Date()
          }
        })

      })
    }
  }
}

export function testCallback2 (properties) {
  console.group('testCallback2')
  console.info('[testCallback2] properties:', properties)
  console.groupEnd()
}
