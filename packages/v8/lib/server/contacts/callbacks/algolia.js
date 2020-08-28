import algoliasearch from 'algoliasearch'
import { getMongoProvider } from '../../../modules/helpers.js'
import { MLAB } from '../../../modules/constants.js'

// callbacks.update.async
export function updateAlgoliaObject ({ document, originalDocument }) {
  if (getMongoProvider() !== MLAB) {
    console.log('Not using mLab, so not updating Algolia.')
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
    if (document.addressString !== originalDocument.addressString) {
      indexedObject.addressString = document.addressString
      dirty = true
    }
    if (document.slug !== originalDocument.slug) {
      indexedObject.url = `/contacts/${document._id}/${document.slug}`
      dirty = true
    }

    if (dirty) {
      indexedObject.updatedAt = new Date()
      const client = algoliasearch(applicationid, addupdatekey)
      const index = client.initIndex(algoliaindex)
      index
        .partialUpdateObject(indexedObject, { createIfNotExists: true })
        .then(response => { console.log('contacts partialUpdateObject response:', response) })
        .catch(error => { console.error('contacts partialUpdateObject error:', JSON.stringify(error, null, 2)) })
    }
  }
}

// callbacks.create.async
export function createAlgoliaObject ({ document }) {
  if (getMongoProvider() !== MLAB) {
    console.log('Not using mLab, so not updating Algolia.')
    return
  }
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey

    const indexedObject = {
      objectID: document._id,
      name: document.displayName,
      addressString: document.addressString,
      body: document.body,
      url: `/contacts/${document._id}/${document.slug}`,
      updatedAt: document.createdAt,
      boosted: 3
    }

    const client = algoliasearch(applicationid, addupdatekey)
    const index = client.initIndex(algoliaindex)
    index
      .saveObject(indexedObject)
      .then(response => { console.log('contacts saveObject response:', response) })
      .catch(error => { console.error('contacts saveObject error:', JSON.stringify(error, null, 2)) })
  }
}
