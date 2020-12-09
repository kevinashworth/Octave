/* Algolia functions, within Meteor.startup block */
import algoliasearch from 'algoliasearch'
import { logger } from '../logger.js'
import Contacts from '../../modules/contacts/collection.js'
import Offices from '../../modules/offices/collection.js'
import Projects from '../../modules/projects/collection.js'
import PastProjects from '../../modules/past-projects/collection.js'
import algoliaSettings from './algolia-settings.js'

const applicationid = Meteor.settings.public.algolia.ApplicationID
const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey

// See https://www.algolia.com/doc/api-reference/api-methods/set-settings/
const setAlgoliaSettings = () => {
  const client = algoliasearch(applicationid, addupdatekey)
  const index = client.initIndex(algoliaindex)
  index.setSettings(algoliaSettings)
    .then(response => {
      logger.info('Response from Algolia setSettings:')
      logger.info(response)
    })
    .catch(error => {
      logger.error('Algolia setSettings error:')
      logger.error(error)
    })
  // index.getSettings()
  //   .then(response => {
  //     logger.info('Response from Algolia getSettings:')
  //     logger.info(response)
  //   })
  //   .catch(error => {
  //     logger.error('Algolia getSettings error:')
  //     logger.error(error)
  //   })
}

// See https://www.algolia.com/doc/api-reference/api-methods/clear-objects/
const clearAlgoliaIndex = () => {
  const client = algoliasearch(applicationid, addupdatekey)
  const index = client.initIndex(algoliaindex)
  index.clearObjects()
    .then(response => {
      logger.info('Response from Algolia clearObjects:')
      logger.info(response)
    })
    .catch(error => {
      logger.error('Algolia clearObjects error:')
      logger.error(error)
    })
}

// See https://www.algolia.com/doc/api-reference/api-methods/save-objects/
/**
 * @summary Populate the Algolia Index, either with passed arrays or from the database
 * @param {array} contacts (optional)
 * @param {array} offices (optional)
 * @param {array} projects (optional)
 * @param {boolean} populatePastProjects (optional)
 * @param {array} pastProjects (doubly optional)
 */
const populateAlgoliaIndex = (contacts, offices, projects, populatePastProjects, pastProjects) => {
  const client = algoliasearch(applicationid, addupdatekey)
  const index = client.initIndex(algoliaindex)
  const objects = []
  const contactsArray = (contacts && contacts.length) ? contacts : Contacts.find().fetch()
  contactsArray.forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.displayName,
      addressString: o.addressString,
      body: o.body,
      url: `/contacts/${o._id}/${o.slug}`,
      updatedAt: o.updatedAt ? o.updatedAt : o.createdAt,
      boosted: 3
    }
    objects.push(indexedObject)
  })
  const officesArray = (offices && offices.length) ? offices : Offices.find().fetch()
  officesArray.forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.displayName,
      addressString: o.fullAddress,
      body: o.body,
      url: `/offices/${o._id}/${o.slug}`,
      updatedAt: o.updatedAt ? o.updatedAt : o.createdAt,
      boosted: 1
    }
    objects.push(indexedObject)
  })
  const projectsArray = (projects && projects.length) ? projects : Projects.find().fetch()
  projectsArray.forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.projectTitle,
      body: o.summary,
      notes: o.notes,
      network: o.network,
      url: `/projects/${o._id}/${o.slug}`,
      updatedAt: o.updatedAt ? o.updatedAt : o.createdAt,
      boosted: 2
    }
    objects.push(indexedObject)
  })
  if (populatePastProjects) {
    const pastProjectsArray = (pastProjects && pastProjects.length) ? pastProjects : PastProjects.find().fetch()
    pastProjectsArray.forEach((o) => {
      const indexedObject = {
        objectID: o._id,
        name: o.projectTitle,
        body: o.summary,
        notes: o.notes,
        network: o.network,
        url: `/past-projects/${o._id}/${o.slug}`,
        updatedAt: o.updatedAt ? o.updatedAt : o.createdAt,
        boosted: 0
      }
      objects.push(indexedObject)
    })
  }
  index
    .saveObjects(objects)
    .then((response) => {
      logger.info('Response from Algolia saveObjects:')
      logger.info(response)
    })
    .catch(error => {
      logger.error('Algolia saveObjects error:')
      logger.error(error)
    })
}

export const initializeAlgolia = () => {
  logger.info('About to run setAlgoliaSettings / clearAlgoliaIndex / populateAlgoliaIndex')
  setAlgoliaSettings()
  clearAlgoliaIndex()
  populateAlgoliaIndex()
}

export const populateAlgoliaMockaroo = (contacts, offices, projects) => {
  logger.info('About to run populateAlgoliaIndex')
  populateAlgoliaIndex(contacts, offices, projects)
}
