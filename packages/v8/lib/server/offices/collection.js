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
  OfficeCreateFormatPhones,
  OfficeUpdateFormatPhones,
  OfficeEditUpdateHistoryAfter
} from './callbacks/index.js'

extendCollection(Offices, {
  callbacks: {
    create: {
      before: [OfficeCreateFormatPhones],
      after: [
        OfficeCreateUpdateContacts,
        OfficeEditUpdatePastProjects,
        OfficeCreateUpdateProjects
      ],
      async: [createAlgoliaObject]
    },
    update: {
      before: [
        OfficeEditUpdateContacts,
        OfficeEditUpdatePastProjects,
        OfficeEditUpdateProjects,
        OfficeUpdateFormatPhones
      ],
      after: [OfficeEditUpdateHistoryAfter],
      async: [updateAlgoliaObject]
    }
  }
})

Offices.rawCollection().createIndex({ updatedAt: -1 })
