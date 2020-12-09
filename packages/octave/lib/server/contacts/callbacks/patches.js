import { Connectors, newMutation } from 'meteor/vulcan:core'
import * as jsonpatch from 'fast-json-patch'
import cloneDeep from 'lodash/cloneDeep'
import log from 'loglevel'
import omitDeep from 'omit-deep'
import Patches from '../../../modules/patches/collection.js'
import { isEmptyValue } from '../../../modules/helpers.js'

// TODO: account for normalized data we may want to track, e.g., officeLocation
const justTheIds = (document) => {
  let results = {}
  if (!isEmptyValue(document.contacts)) {
    results.contacts = document.contacts.map(contact => (contact.contactId))
  }
  if (!isEmptyValue(document.offices)) {
    results.offices = document.offices.map(office => (office.officeId))
  }
  if (!isEmptyValue(document.projects)) {
    results.projects = document.projects.map(project => (project.projectId))
  }
  if (!isEmptyValue(document.pastProjects)) {
    results.pastProjects = document.pastProjects.map(project => (project.projectId))
  }
  results = {
    ...document,
    ...results
  }
  return results
}

export function updatePatches ({ currentUser, document, originalDocument }) {
  const doNotDiff = ['createdAt', 'updatedAt', 'allLinks', 'addressString', 'theAddress', 'allAddresses']
  const prunedDocument = justTheIds(document)
  const prunedOrigDocument = justTheIds(originalDocument)
  log.debug('pruned document:')
  console.dir(prunedDocument)
  log.debug('pruned originalDocument:')
  console.dir(prunedOrigDocument)
  const myDocument = cloneDeep(omitDeep(prunedDocument, doNotDiff))
  const myOriginalDocument = cloneDeep(omitDeep(prunedOrigDocument, doNotDiff))

  const patch = jsonpatch.compare(myDocument, myOriginalDocument, true)
  if (patch.length > 0) {
    const objectId = originalDocument._id
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
