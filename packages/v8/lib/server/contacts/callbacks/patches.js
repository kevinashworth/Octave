import { Connectors, newMutation } from 'meteor/vulcan:core'
import * as jsonpatch from 'fast-json-patch'
import Patches from '../../../modules/patches/collection.js'

export function ContactEditUpdateHistoryAfter (document, { currentUser, originalDocument }) {
  const objectId = originalDocument._id;
  // eslint-disable-next-line no-unused-vars
  let myDocument, myOriginalDocument, _id, userId, createdAt, updatedAt, allLinks, fullName, addressString, theAddress, allAddresses;
  ({ _id, userId, createdAt, updatedAt, allLinks, fullName, addressString, theAddress, allAddresses, ...myDocument } = document);
  ({ _id, userId, createdAt, updatedAt, allLinks, fullName, addressString, theAddress, allAddresses, ...myOriginalDocument } = originalDocument);

  const patch = jsonpatch.compare(myDocument, myOriginalDocument, true)

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
