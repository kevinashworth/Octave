import { Promise } from 'meteor/promise'
import algoliasearch from 'algoliasearch'
import { getFullAddress } from '../../../modules/helpers.js'

const applicationid = Meteor.settings.private.algolia.ApplicationID
const adminapikey   = Meteor.settings.private.algolia.AdminAPIKey
const algoliaindex  = Meteor.settings.private.algolia.AlgoliaIndex

const fullAddress = (office) => {
  if (office.addresses && office.addresses[0]) {
    return getFullAddress(office.addresses[0])
  }
  return null
}

export function OfficeEditUpdateAlgoliaBefore (data, { document, originalDocument }) {
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
    const client = algoliasearch(applicationid, adminapikey)
    const index = client.initIndex(algoliaindex)
    indexedObject['updatedAt'] = new Date()
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
}

export function OfficeCreateSaveToAlgolia (document) {
  const indexedObject = {
    objectID: document._id,
    name: document.displayName,
    addressString: document.fullAddress,
    body: document.body,
    url: `/offices/${document._id}/${document.slug}`,
    updatedAt: document.createdAt,
    boosted: 1
  }

  const client = algoliasearch(applicationid, adminapikey)
  const index = client.initIndex(algoliaindex)
  Promise.await(index.saveObject(indexedObject)
    .then(response => console.log('saveObject response:', response))
    .catch(error => console.error('saveObject error:', error))
  )
}
