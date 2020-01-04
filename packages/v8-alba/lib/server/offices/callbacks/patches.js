import { Connectors, newMutation } from 'meteor/vulcan:core'
import * as jsonpatch from 'fast-json-patch'
import Patches from '../../../modules/patches/collection.js'

export function OfficeEditUpdateHistoryBefore (data, { currentUser, document, originalDocument }) {
  const objectId = originalDocument._id
  const patch = jsonpatch.compare(originalDocument, document)

  if (patch.length > 0) { // If there are no differences, `compare` returns an empty array (length 0)
    const patchHistory = Patches.findOne(objectId)
    if (patchHistory) {
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
    } else {
      const newPatchDocument = {
        _id: objectId,
        collectionName: 'Offices',
        patches: [{
          date: new Date().toUTCString(),
          patch
        }]
      }
      newMutation({
        action: 'patches.new',
        collection: Patches,
        document: newPatchDocument,
        currentUser,
        validate: false
      })
    }
  }
}
