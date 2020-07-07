import { extendCollection } from 'meteor/vulcan:core'
import { PastProjects } from '../../modules/past-projects/collection.js'
import {
  PastProjectEditUpdateAlgoliaBefore,
  PastProjectEditUpdateContacts,
  PastProjectEditUpdateOfficesBefore,
  PastProjectEditUpdateStatusAfter
} from './callbacks/index.js'

extendCollection(PastProjects, {
  callbacks: {
    update: {
      before: [PastProjectEditUpdateAlgoliaBefore, PastProjectEditUpdateOfficesBefore],
      after: [PastProjectEditUpdateContacts, PastProjectEditUpdateStatusAfter]
    }
  }
})

// create: {
//   after: [PastProjectCreateUpdateOfficeAfter],
// async: [PastProjectUpdateStatisticsAsync]
// },

// PastProjectCreateUpdateOfficeAfter,
// PastProjectUpdateStatisticsAsync,

PastProjects.rawCollection().createIndex({ updatedAt: -1 })
