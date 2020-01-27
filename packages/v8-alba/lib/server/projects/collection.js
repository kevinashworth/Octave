import { extendCollection } from 'meteor/vulcan:core'
import { Projects } from '../../modules/projects/collection.js'
import {
  ProjectEditUpdateAlgoliaBefore,
  ProjectCreateSaveToAlgolia,
  ProjectEditUpdateContacts,
  ProjectCreateUpdateContacts,
  ProjectEditUpdateOfficesBefore,
  ProjectCreateUpdateOfficesAfter,
  ProjectCreateUpdateStatisticsAfter,
  testCallback2,
  ProjectEditUpdateStatusAfter,
  ProjectEditUpdateHistoryAfter
} from './callbacks/index.js'

extendCollection(Projects, {
  callbacks: {
    create: {
      after: [ProjectCreateSaveToAlgolia, ProjectCreateUpdateContacts, ProjectCreateUpdateOfficesAfter, ProjectCreateUpdateStatisticsAfter]
    },
    update: {
      after: [ProjectEditUpdateContacts, ProjectEditUpdateHistoryAfter, ProjectEditUpdateStatusAfter],
      before: [ProjectEditUpdateAlgoliaBefore, ProjectEditUpdateOfficesBefore],
      async: [testCallback2]
    }
  }
})
