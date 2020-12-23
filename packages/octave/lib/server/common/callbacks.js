import { Connectors, getSetting } from 'meteor/vulcan:core'
import algoliasearch from 'algoliasearch'
import includes from 'lodash/includes'
import log from 'loglevel'
import { logger } from '../logger'
import Comments from '../../modules/comments/collection'
import { DBS } from '../../modules/constants'
import { getMongoProvider } from '../../modules/helpers'

// callbacks.delete.async
export function deleteAlgoliaObject ({ document }) {
  const db = getMongoProvider()
  let shouldUpdateAlgolia = true
  let warning = 'Updating Algolia'
  if (getSetting('mockaroo.initializeAlgolia')) {
    shouldUpdateAlgolia = false
    warning = 'Skipping object update to initialize Algolia as a batch.'
  }
  if (getSetting('mockaroo.updateAlgolia')) {
    shouldUpdateAlgolia = true
    warning = 'Updating object on Algolia.'
  } else if (!includes(DBS, db)) {
    shouldUpdateAlgolia = false
    warning = 'No Atlas, no mLab. Not sending to Algolia'
  }
  if (getSetting('cypress')) {
    shouldUpdateAlgolia = true
    warning = 'Cypress test environment. Sending to Algolia.'
  }

  if (!shouldUpdateAlgolia) {
    log.debug(warning)
    return
  }

  if (Meteor.settings.private && Meteor.settings.private.algolia) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const deleteapikey = Meteor.settings.private.algolia.DeleteAPIKey

    const objectID = document._id
    logger.info('About to deleteAlgoliaObject' + objectID)

    const client = algoliasearch(applicationid, deleteapikey)
    const index = client.initIndex(algoliaindex)
    index
      .deleteObject(objectID)
      .then(response => { console.log('projects deleteObject response:', response) })
      .catch(error => { console.error('projects deleteObject error:', JSON.stringify(error, null, 2)) })
  }
}

// callbacks.delete.async
export const deleteComments = ({ document }) => {
  logger.info('Deleting comments for document', document._id)
  Comments.find({ objectId: { $eq: document._id } }).forEach(comment => {
    logger.info('Deleting comment', comment._id)
    Connectors.delete(Comments, comment._id)
  })
}
