/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/

import { Promise } from 'meteor/promise'
import { Connectors, newMutation } from 'meteor/vulcan:core'
import * as jsonpatch from 'fast-json-patch'
// import _ from 'lodash'
import Patches from '../../../modules/patches/collection.js'

export function OfficeEditUpdateHistoryBefore (data, { currentUser, document, originalDocument }) {
  var objectId = originalDocument._id

  let { ...newDoc } = document
  // newDoc.updatedAt = data.updatedAt && typeof data.updatedAt === 'object'
  //                     ? data.updatedAt.toUTCString()
  //                     : new Date().toUTCString()

  let { ...oldDoc } = originalDocument
  // oldDoc.updatedAt = originalDocument.updatedAt && typeof originalDocument.updatedAt === 'object'
  //                     ? originalDocument.updatedAt.toUTCString()
  //                     : new Date().toUTCString()

  var patch = jsonpatch.compare(oldDoc, newDoc)
  console.log(`[KA] ${objectId} fast-json-patch:`, patch)

  // If there are no differences, `compare` returns an empty array (length 0).
  if (patch.length > 0) {
    const patchHistory = Patches.findOne(objectId)
    if (patchHistory) {
      Promise.await(
        Connectors.update(Patches, objectId,
          {
            $set: { collectionName: 'Offices' },
            $addToSet: {
              patches: {
                date: new Date().toUTCString(),
                patch
              }
            }
          }
        )
      )
    } else {
      const theHistory = {
        _id: objectId,
        collectionName: 'Offices',
        patches: [{
          date: new Date().toUTCString(),
          patch
        }]
      }
      Promise.await(newMutation({
        action: 'histories.new',
        collection: Patches,
        document: theHistory,
        currentUser,
        validate: false
      }))

    }
  }
}
