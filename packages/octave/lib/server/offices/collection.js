import { extendCollection } from 'meteor/vulcan:core'
import { Offices } from '../../modules/offices/collection.js'
import {
  createOfficeFormatPhones,
  updateOfficeFormatPhones,
  createAlgoliaObject,
  updateAlgoliaObject,
  createOfficeUpdateContacts,
  updateOfficeUpdateContacts,
  createOfficeUpdateProjects,
  updateOfficeUpdateProjects,
  createOfficeUpdatePastProjects,
  updateOfficeUpdatePastProjects
} from './callbacks/index.js'
import { deleteAlgoliaObject, deleteComments } from '../common/callbacks'
import { updatePatches } from '../patches/callback'

extendCollection(Offices, {
  callbacks: {
    create: {
      before: [
        createOfficeFormatPhones
      ],
      async: [
        createAlgoliaObject,
        createOfficeUpdateContacts,
        createOfficeUpdateProjects,
        createOfficeUpdatePastProjects
      ]
    },
    update: {
      before: [
        updateOfficeFormatPhones
      ],
      async: [
        updateAlgoliaObject,
        updateOfficeUpdateContacts,
        updateOfficeUpdateProjects,
        updateOfficeUpdatePastProjects,
        updatePatches
      ]
    },
    delete: {
      async: [
        deleteAlgoliaObject,
        deleteComments
      ]
    }
  }
})

Offices.rawCollection().createIndex({ updatedAt: -1 })
