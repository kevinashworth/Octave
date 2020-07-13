/* eslint-disable no-undef */
import { Promise } from 'meteor/promise'
import algoliasearch from 'algoliasearch'
import includes from 'lodash/includes'
import { ACTIVE_PROJECT_STATUSES_ARRAY } from '../../../modules/constants.js'

export function ProjectEditUpdateAlgoliaBefore (data, { document, originalDocument }) {
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.private.algolia.AlgoliaIndex
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

export function ProjectCreateSaveToAlgolia (document) {
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.private.algolia.AlgoliaIndex
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
    Promise.await(index.saveObject(indexedObject)
      .then(response => console.log('saveObject response:', response))
      .catch(error => console.error('saveObject error:', error))
    )
  } else {
    return document
  }
}
