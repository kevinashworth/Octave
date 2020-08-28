import { extendCollection } from 'meteor/vulcan:core'
import { PastProjects } from '../../modules/past-projects/collection.js'
import {
  updateAlgoliaObject,
  PastProjectEditUpdateContacts,
  PastProjectEditUpdateOfficesBefore,
  PastProjectEditUpdateStatusAfter
} from './callbacks/index.js'

extendCollection(PastProjects, {
  callbacks: {
    update: {
      before: [PastProjectEditUpdateOfficesBefore],
      after: [PastProjectEditUpdateContacts, PastProjectEditUpdateStatusAfter],
      async: [updateAlgoliaObject]
    }
  }
})

PastProjects.rawCollection().createIndex({ updatedAt: -1 })
