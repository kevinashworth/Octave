import { Connectors, newMutation } from 'meteor/vulcan:core'
import * as jsonpatch from 'fast-json-patch'
import cloneDeep from 'lodash/cloneDeep'
import log from 'loglevel'
import omitDeep from 'omit-deep'
import Patches from '../../modules/patches/collection.js'
import { isEmptyValue } from '../../modules/helpers.js'

// TODO: account for normalized data we may want to track, e.g., officeLocation
const keepOnlySubSchemaIds = (document) => {
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

const doNotDiff = {
  Contacts: ['createdAt', 'updatedAt', 'allLinks', 'addressString', 'theAddress', 'allAddresses'],
  Offices: ['createdAt', 'updatedAt', 'theContacts', 'theProjects'],
  Projects: ['createdAt', 'updatedAt']
}

// this callbacks.update.async function has one parameter, 'properties',
// as documented at https://docs.vulcanjs.org/callbacks.html#properties
export function updatePatches ({ currentUser, document, originalDocument, collection }) {
  const collectionName = collection.collectionName
  log.debug(`Begin updatePatches (${collectionName})`)

  const prunedDocument = keepOnlySubSchemaIds(document)
  const prunedOriginalDocument = keepOnlySubSchemaIds(originalDocument)

  // log.debug('updatePatches pruned document:')
  // console.dir(prunedDocument)
  // log.debug('updatePatches pruned originalDocument:')
  // console.dir(prunedOriginalDocument)

  // NB: omitDeep mutates prunedDocument
  // TODO: get better clone/omit package
  const trimmedDocument = cloneDeep(omitDeep(prunedDocument, doNotDiff[collectionName]))
  const trimmedOriginalDocument = cloneDeep(omitDeep(prunedOriginalDocument, doNotDiff[collectionName]))

  log.debug('updatePatches trimmed document:')
  console.dir(trimmedDocument)
  log.debug('updatePatches trimmed originalDocument:')
  console.dir(trimmedOriginalDocument)

  const patch = jsonpatch.compare(trimmedDocument, trimmedOriginalDocument, true)

  log.debug('updatePatches patch:')
  console.dir(patch)

  if (patch.length > 0) {
    const objectId = originalDocument._id
    const patchHistory = Patches.findOne(objectId)
    if (patchHistory) {
      Connectors.update(Patches, objectId,
        {
          $set: { collectionName },
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
        collectionName,
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
