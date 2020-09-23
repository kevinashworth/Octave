import algoliasearch from 'algoliasearch'
import log from 'loglevel'
import { ATLAS, MLAB } from '../../../modules/constants.js'
import { getFullAddress, getMongoProvider } from '../../../modules/helpers.js'

const fullAddress = (office) => {
  if (office.addresses && office.addresses[0]) {
    return getFullAddress(office.addresses[0])
  }
  return null
}

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
    if (document.body !== originalDocument.body) {
      indexedObject.body = document.body
      dirty = true
    }
    if (document.displayName !== originalDocument.displayName) {
      indexedObject.name = document.displayName
      dirty = true
    }
    const docFullAddress = fullAddress(document)
    const origFullAddress = fullAddress(originalDocument)
    if (docFullAddress !== origFullAddress) {
      indexedObject.addressString = docFullAddress
      dirty = true
    }
    if (document.slug !== originalDocument.slug) {
      indexedObject.url = `/offices/${document._id}/${document.slug}`
      dirty = true
    }

    if (dirty) {
      indexedObject.updatedAt = new Date()
      const client = algoliasearch(applicationid, addupdatekey)
      const index = client.initIndex(algoliaindex)
      index
        .partialUpdateObject(indexedObject, { createIfNotExists: true })
        .then(response => { console.log('offices partialUpdateObject response:', response) })
        .catch(error => { console.error('offices partialUpdateObject error:', JSON.stringify(error, null, 2)) })
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
      name: document.displayName,
      addressString: document.fullAddress,
      body: document.body,
      url: `/offices/${document._id}/${document.slug}`,
      updatedAt: document.createdAt,
      boosted: 1
    }

    const client = algoliasearch(applicationid, addupdatekey)
    const index = client.initIndex(algoliaindex)
    index
      .saveObject(indexedObject)
      .then(response => { console.log('offices saveObject response:', response) })
      .catch(error => { console.error('offices saveObject error:', JSON.stringify(error, null, 2)) })
  }
}
