import { getSetting } from 'meteor/vulcan:core'
import algoliasearch from 'algoliasearch'
// import log from 'loglevel'
import { logger } from '../../logger.js'
import createIndexedObject from '../../algolia/helpers'
import { getMongoProvider } from '../../../modules/helpers.js'
import { BOOSTED, DBS } from '../../../modules/constants.js'

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
    logger.info(warning)
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
    if (document.addressString !== originalDocument.addressString) {
      indexedObject.addressString = document.addressString
      dirty = true
    }
    if (document.body !== originalDocument.body) {
      indexedObject.body = document.body
      dirty = true
    }
    if (document.displayName !== originalDocument.displayName) {
      indexedObject.name = document.displayName
      dirty = true
    }
    if (document.slug !== originalDocument.slug) {
      indexedObject.url = `/contacts/${document._id}/${document.slug}`
      dirty = true
    }

    if (dirty) {
      indexedObject.boosted = BOOSTED.CONTACTS
      indexedObject.updatedAt = new Date()
      const client = algoliasearch(applicationid, addupdatekey)
      const index = client.initIndex(algoliaindex)
      index
        .partialUpdateObject(indexedObject, { createIfNotExists: true })
        .then(response => { logger.info('contacts partialUpdateObject response:' + JSON.stringify(response)) })
        .catch(error => { logger.info('contacts partialUpdateObject error:' + JSON.stringify(error)) })
    }
  }
}

// callbacks.create.async
export function createAlgoliaObject ({ document }) {
  if (!shouldUpdateAlgolia) {
    logger.info(warning)
    return
  }
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey

    const indexedObject = createIndexedObject({ collectionName: 'contacts', document, sourceDb: db })

    const client = algoliasearch(applicationid, addupdatekey)
    const index = client.initIndex(algoliaindex)
    index
      .saveObject(indexedObject)
      .then(response => { logger.info('contacts saveObject response:' + JSON.stringify(response)) })
      .catch(error => { logger.info('contacts saveObject error:' + JSON.stringify(error)) })
  }
}
