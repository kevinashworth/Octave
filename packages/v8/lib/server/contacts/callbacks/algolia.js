/* eslint-disable no-undef */
import { Promise } from 'meteor/promise'
import algoliasearch from 'algoliasearch'

export function ContactEditUpdateAlgoliaBefore (data, { document, originalDocument }) {
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.private.algolia.AlgoliaIndex
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
      const client = algoliasearch(applicationid, addupdatekey)
      const index = client.initIndex(algoliaindex)
      indexedObject.updatedAt = new Date()
      Promise.await(
        index.partialUpdateObject(
          indexedObject,
          { createIfNotExists: true }
        )
          .then(response => {
            console.log('partialUpdateObject response:', response)
          })
          .catch(error => {
            console.error('partialUpdateObject error:', error)
          })
      )
    }
  } else {
    return data
  }
}

export function ContactCreateSaveToAlgolia (document) {
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.private.algolia.AlgoliaIndex
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
    Promise.await(index.saveObject(indexedObject)
      .then(response => console.log('saveObject response:', response))
      .catch(error => console.error('saveObject error:', error))
    )
  } else {
    return document
  }
}
