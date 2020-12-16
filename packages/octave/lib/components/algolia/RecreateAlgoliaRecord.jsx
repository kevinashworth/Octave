import { withMessages } from 'meteor/vulcan:core'
import React from 'react'
import Button from 'react-bootstrap/Button'
import createIndexedObject from '../../server/algolia/helpers'

const RecreateAlgoliaRecord = ({ collectionName, document, flash, variant }) => {
  const updateAlgolia = ({ collectionName, document }) => {
    const indexedObject = createIndexedObject({ collectionName, document })

    Meteor.call(
      'recreateAlgoliaRecord',
      indexedObject,
      (error, result) => { // we expect result to be undefined
        if (error) {
          flash({
            message: `recreateAlgoliaRecord error: ${error}`,
            type: 'error'
          })
        } else {
          flash({
            message: `Re-created record for ${document._id} sent to Algolia.`,
            type: 'info'
          })
        }
      })
  }

  return (
    <Button onClick={() => updateAlgolia({ collectionName, document })}>Create Algolia Record</Button>
  )
}

export default withMessages(RecreateAlgoliaRecord)
