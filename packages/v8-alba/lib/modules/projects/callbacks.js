import { addCallback, Connectors, createMutator, deleteMutator } from 'meteor/vulcan:core'
import _ from 'lodash'
import Contacts from '../contacts/collection.js'
import Offices from '../offices/collection.js'
import Projects from './collection.js'
import PastProjects from '../past-projects/collection.js'
import { PAST_PROJECT_STATUSES_ARRAY } from '../constants.js'
import { isEmptyValue } from '../helpers.js'

async function ProjectUpdateStatusAsync (document, oldDocument, currentUser, collection) {
  console.log('[ProjectUpdateStatusAsync] document.status:', document.status)
  console.log('[ProjectUpdateStatusAsync] oldDocument.status:', oldDocument.status)

  // if the new status is now a past-project, create a new past-project then remove this active project
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
        validate: false
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

// function testCallback1 (document, oldDocument, currentUser, collection) {
//   console.group('testCallback1')
//   console.info('[testCallback1] document._id:', document._id)
//   console.info('[testCallback1] collection.collectionName:', collection.collectionName)
//   console.groupEnd()
// }

addCallback('projects.edit.async', ProjectUpdateStatusAsync)
