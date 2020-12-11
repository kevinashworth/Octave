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
  updateOfficeUpdatePastProjects,
  OfficeEditUpdateHistoryAfter
} from './callbacks/index.js'

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
      after: [OfficeEditUpdateHistoryAfter],
      async: [
        updateAlgoliaObject,
        updateOfficeUpdateContacts,
        updateOfficeUpdateProjects,
        updateOfficeUpdatePastProjects
      ]
    }
  }
})

Offices.rawCollection().createIndex({ updatedAt: -1 })
