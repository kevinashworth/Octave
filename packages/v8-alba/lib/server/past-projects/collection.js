import { extendCollection } from 'meteor/vulcan:core'
import { PastProjects } from '../../modules/past-projects/collection.js'
import {
  PastProjectEditUpdateAlgoliaBefore,
  PastProjectEditUpdateContacts,
  PastProjectEditUpdateOfficeBefore,
  PastProjectEditUpdateStatusAfter
} from './callbacks/index.js'

extendCollection(PastProjects, {
  callbacks: {
    update: {
      before: [PastProjectEditUpdateAlgoliaBefore, PastProjectEditUpdateOfficeBefore],
      after: [PastProjectEditUpdateContacts, PastProjectEditUpdateStatusAfter]
    }
  }
})

// create: {
//   after: [PastProjectCreateUpdateContacts, PastProjectCreateUpdateOfficeAfter, PastProjectCreateUpdateStatisticsAfter]
// },

// PastProjectCreateUpdateContacts,
// PastProjectCreateUpdateOfficeAfter,
// PastProjectCreateUpdateStatisticsAfter,
