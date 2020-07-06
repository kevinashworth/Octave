import { Connectors, newMutation } from 'meteor/vulcan:core'
import * as jsonpatch from 'fast-json-patch'
import cloneDeep from 'lodash/cloneDeep'
import omitDeep from 'omit-deep'
import Patches from '../../../modules/patches/collection.js'

export function ContactEditUpdateHistoryAfter (document, { currentUser, originalDocument }) {
  const objectId = originalDocument._id
  const doNotDiff = ['createdAt', 'updatedAt', 'allLinks', 'fullName', 'addressString', 'theAddress', 'allAddresses']
  const myDocument = cloneDeep(omitDeep(document, doNotDiff))
  const myOriginalDocument = cloneDeep(omitDeep(originalDocument, doNotDiff))
  const patch = jsonpatch.compare(myDocument, myOriginalDocument, true)

  if (patch.length > 0) { // If there are no differences, returns an empty array (length 0)
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
