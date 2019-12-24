import { extendCollection } from 'meteor/vulcan:core'
import { PastProjects } from '../../modules/past-projects/collection.js'
import {
  PastProjectEditUpdateAlgoliaBefore,
  PastProjectEditUpdateContacts,
  PastProjectEditUpdateOfficeBefore,
  PastProjectCreateUpdateContacts,
  PastProjectCreateUpdateOfficeAfter,
  PastProjectCreateUpdateStatisticsAfter,
  PastProjectEditUpdateStatusAfter
} from './callbacks/index.js'

extendCollection(PastProjects, {
  callbacks: {
    create: {
      after: [PastProjectCreateUpdateContacts, PastProjectCreateUpdateOfficeAfter, PastProjectCreateUpdateStatisticsAfter]
    },
    update: {
      before: [PastProjectEditUpdateAlgoliaBefore, PastProjectEditUpdateOfficeBefore],
      after: [PastProjectEditUpdateContacts, PastProjectEditUpdateStatusAfter]
    }
  }
})
