import { Connectors, newMutation } from 'meteor/vulcan:core'
import * as jsonpatch from 'fast-json-patch'
import Patches from '../../../modules/patches/collection.js'

export function ContactEditUpdateHistoryAfter (document, { currentUser, originalDocument }) {
  const objectId = originalDocument._id;
  // eslint-disable-next-line no-unused-vars
  let myDocument, myOriginalDocument, _id, userId, createdAt, updatedAt;
  ({ _id, userId, createdAt, updatedAt, ...myDocument } = document);
  ({ _id, userId, createdAt, updatedAt, ...myOriginalDocument } = originalDocument);

  // var myOriginalDocument = { ...originalDocument }
  // const patch = jsonpatch.compare(myOriginalDocument, myDocument, true)
  const patch = jsonpatch.compare(myDocument, myOriginalDocument, true)
  // console.log('[KA] do we want patch2?', patch2)

  if (patch.length > 0) { // If there are no differences, `compare` returns an empty array (length 0)
    const patchHistory = Patches.findOne(objectId)
    if (patchHistory) {
      Connectors.update(Patches, objectId,
        {
          $set: { collectionName: 'Contacts' },
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
        collectionName: 'Contacts',
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
