import { getSetting } from 'meteor/vulcan:core'
import algoliasearch from 'algoliasearch'
import includes from 'lodash/includes'
import log from 'loglevel'
import { getMongoProvider } from '../../../modules/helpers.js'
import { ACTIVE_PROJECT_STATUSES_ARRAY, BOOSTED, DBS } from '../../../modules/constants.js'

const db = getMongoProvider()
let shouldUpdateAlgolia = true
let warning = 'Updating Algolia'
if (getSetting('mockaroo.initializeAlgolia')) {
  shouldUpdateAlgolia = false
  warning = 'Skipping object update to initialize Algolia as a batch.'
} if (getSetting('mockaroo.updateAlgolia')) {
  shouldUpdateAlgolia = true
  warning = 'Updating object on Algolia.'
} else if (!DBS.includes(db)) {
  shouldUpdateAlgolia = false
  warning = 'No Atlas, no mLab. Not sending to Algolia'
}

// callbacks.update.async
export function updateAlgoliaObject ({ document, originalDocument }) {
  if (!shouldUpdateAlgolia) {
    log.debug(warning)
    return
  }
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey

    const indexedObject = {
      objectID: document._id
    }
    let dirty = false
    if (document.summary !== originalDocument.summary) {
      indexedObject.body = document.summary
      dirty = true
    }
    if (document.projectTitle !== originalDocument.projectTitle) {
      indexedObject.name = document.projectTitle
      dirty = true
    }
    if (document.network !== originalDocument.network) {
      indexedObject.network = document.network
      dirty = true
    }
    if (document.notes !== originalDocument.notes) {
      indexedObject.notes = document.notes
      dirty = true
    }
    if (document.slug !== originalDocument.slug) {
      indexedObject.url = `/projects/${document._id}/${document.slug}`
      dirty = true
    }
    if (document.status !== originalDocument.status) {
      if (includes(ACTIVE_PROJECT_STATUSES_ARRAY, document.status)) {
        indexedObject.url = `/projects/${document._id}/${document.slug}`
      } else {
        indexedObject.url = `/past-projects/${document._id}/${document.slug}`
      }
      dirty = true
    }

    if (dirty) {
      if (includes(ACTIVE_PROJECT_STATUSES_ARRAY, document.status)) {
        indexedObject.boosted = BOOSTED.PROJECTS
      } else {
        indexedObject.boosted = BOOSTED.PASTPROJECTS
      }
      indexedObject.updatedAt = new Date()
      const client = algoliasearch(applicationid, addupdatekey)
      const index = client.initIndex(algoliaindex)
      index
        .partialUpdateObject(indexedObject, { createIfNotExists: true })
        .then(response => { console.log('projects partialUpdateObject response:', response) })
        .catch(error => { console.error('projects partialUpdateObject error:', JSON.stringify(error, null, 2)) })
    }
  }
}

// callbacks.create.async
export function createAlgoliaObject ({ document }) {
  if (!shouldUpdateAlgolia) {
    log.debug(warning)
    return
  }
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey

    const indexedObject = {
      body: document.summary,
      boosted: BOOSTED.PROJECTS,
      name: document.projectTitle,
      network: document.network,
      notes: document.notes,
      objectID: document._id,
      source: document.source || db,
      updatedAt: document.createdAt,
      url: `/projects/${document._id}/${document.slug}`
    }

    const client = algoliasearch(applicationid, addupdatekey)
    const index = client.initIndex(algoliaindex)
    index
      .saveObject(indexedObject)
      .then(response => { console.log('projects saveObject response:', response) })
      .catch(error => { console.error('projects saveObject error:', JSON.stringify(error, null, 2)) })
  }
}
