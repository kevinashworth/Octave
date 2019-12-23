import { extendCollection } from 'meteor/vulcan:core'
import { PastProjects } from '../../modules/past-projects/collection.js'
import {
  PastProjectEditUpdateAlgoliaBefore,
  PastProjectCreateUpdateContacts,
  PastProjectCreateUpdateOfficeAfter,
  PastProjectCreateUpdateStatisticsAfter,
} from './callbacks/index.js'

extendCollection(PastProjects, {
  callbacks: {
    create: {
      after: [PastProjectCreateUpdateContacts, PastProjectCreateUpdateOfficeAfter, PastProjectCreateUpdateStatisticsAfter]
    },
    update: {
      before: [PastProjectEditUpdateAlgoliaBefore]
    }
  }
})

// PastProjectEditUpdateStatusAfter
// PastProjectEditUpdateOfficeBefore,
// PastProjectEditUpdateContacts,
