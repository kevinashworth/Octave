import algoliasearch from 'algoliasearch'
import includes from 'lodash/includes'
import log from 'loglevel'
import { getMongoProvider } from '../../../modules/helpers.js'
import { ACTIVE_PROJECT_STATUSES_ARRAY, ATLAS, MLAB } from '../../../modules/constants.js'

// callbacks.update.async
export function updateAlgoliaObject ({ document, originalDocument }) {
  const db = getMongoProvider()
  if (db !== ATLAS && db !== MLAB) {
    log.debug('Not using Atlas or mLab, so not updating Algolia.')
    return
  }
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey

    var indexedObject = {
      objectID: document._id
    }
    var dirty = false
    if (document.summary !== originalDocument.summary) {
      indexedObject.body = document.summary
      dirty = true
    }
    if (document.notes !== originalDocument.notes) {
      indexedObject.notes = document.notes
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
  const db = getMongoProvider()
  if (db !== ATLAS && db !== MLAB) {
    log.debug('Not using Atlas or mLab, so not updating Algolia.')
    return
  }
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey

    const indexedObject = {
      objectID: document._id,
      name: document.projectTitle,
      body: document.summary,
      notes: document.notes,
      network: document.network,
      url: `/projects/${document._id}/${document.slug}`,
      updatedAt: document.createdAt,
      boosted: 2
    }

    const client = algoliasearch(applicationid, addupdatekey)
    const index = client.initIndex(algoliaindex)
    index
      .saveObject(indexedObject)
      .then(response => { console.log('projects saveObject response:', response) })
      .catch(error => { console.error('projects saveObject error:', JSON.stringify(error, null, 2)) })
  }
}
