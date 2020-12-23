import { extendCollection } from 'meteor/vulcan:core'
import { PastProjects } from '../../modules/past-projects/collection.js'
import {
  updateAlgoliaObject,
  PastProjectEditUpdateContacts,
  PastProjectEditUpdateOfficesBefore,
  PastProjectEditUpdateStatusAfter
} from './callbacks/index.js'
import { deleteAlgoliaObject, deleteComments } from '../common/callbacks'

extendCollection(PastProjects, {
  callbacks: {
    update: {
      before: [PastProjectEditUpdateOfficesBefore],
      after: [PastProjectEditUpdateContacts, PastProjectEditUpdateStatusAfter],
      async: [updateAlgoliaObject]
    },
    delete: {
      async: [
        deleteAlgoliaObject,
        deleteComments
      ]
    }
  }
})

PastProjects.rawCollection().createIndex({ updatedAt: -1 })
