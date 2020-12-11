import { extendCollection } from 'meteor/vulcan:core'
import { Offices } from '../../modules/offices/collection.js'
import {
  createAlgoliaObject,
  updateAlgoliaObject,
  OfficeCreateUpdateContacts,
  OfficeEditUpdateContacts,
  OfficeEditUpdatePastProjects,
  OfficeCreateUpdateProjects,
  OfficeEditUpdateProjects,
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
        OfficeCreateUpdateContacts,
        OfficeEditUpdatePastProjects,
        OfficeCreateUpdateProjects
      ],
      async: [
        createAlgoliaObject
      ]
    },
    update: {
      before: [
        updateOfficeFormatPhones,
        OfficeEditUpdateContacts,
        OfficeEditUpdatePastProjects,
        OfficeEditUpdateProjects
      ],
      after: [OfficeEditUpdateHistoryAfter],
      async: [
        updateAlgoliaObject
      ]
    }
  }
})

Offices.rawCollection().createIndex({ updatedAt: -1 })
