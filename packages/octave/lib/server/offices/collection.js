import { extendCollection } from 'meteor/vulcan:core'
import { Offices } from '../../modules/offices/collection.js'
import {
  createAlgoliaObject,
  updateAlgoliaObject,
  createOfficeUpdateContacts,
  updateOfficeUpdateContacts,
  createOfficeUpdateProjects,
  updateOfficeUpdateProjects,
  OfficeEditUpdatePastProjects,
  createOfficeFormatPhones,
  updateOfficeFormatPhones,
  OfficeEditUpdateHistoryAfter
} from './callbacks/index.js'

extendCollection(Offices, {
  callbacks: {
    create: {
      before: [
        createOfficeFormatPhones
      ],
      after: [
        OfficeEditUpdatePastProjects
      ],
      async: [
        createAlgoliaObject,
        createOfficeUpdateContacts,
        createOfficeUpdateProjects
      ]
    },
    update: {
      before: [
        updateOfficeFormatPhones,
        OfficeEditUpdatePastProjects
      ],
      after: [OfficeEditUpdateHistoryAfter],
      async: [
        updateAlgoliaObject,
        updateOfficeUpdateContacts,
        updateOfficeUpdateProjects
      ]
    }
  }
})

Offices.rawCollection().createIndex({ updatedAt: -1 })
