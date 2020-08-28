import algoliasearch from 'algoliasearch'
import includes from 'lodash/includes'
import { PAST_PROJECT_STATUSES_ARRAY } from '../../../modules/constants.js'

// callbacks.update.async
export function updateAlgoliaObject ({ document, originalDocument }) {
  /* eslint-disable no-undef */
  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey
    /* eslint-enable no-undef */

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
      indexedObject.url = `/past-projects/${document._id}/${document.slug}`
      dirty = true
    }
    if (document.status !== originalDocument.status) {
      if (includes(PAST_PROJECT_STATUSES_ARRAY, document.status)) {
        indexedObject.url = `/past-projects/${document._id}/${document.slug}`
      } else {
        indexedObject.url = `/projects/${document._id}/${document.slug}`
      }
      dirty = true
    }

    if (dirty) {
      indexedObject.updatedAt = new Date()
      const client = algoliasearch(applicationid, addupdatekey)
      const index = client.initIndex(algoliaindex)
      index
        .partialUpdateObject(indexedObject, { createIfNotExists: true })
        .then(response => { console.log('past-projects partialUpdateObject response:', response) })
        .catch(error => { console.error('past-projects partialUpdateObject error:', JSON.stringify(error, null, 2)) })
    }
  }
}
