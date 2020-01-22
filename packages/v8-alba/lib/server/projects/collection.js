import { extendCollection } from 'meteor/vulcan:core'
import { Projects } from '../../modules/projects/collection.js'
import {
  ProjectEditUpdateAlgoliaBefore,
  ProjectCreateSaveToAlgolia,
  ProjectEditUpdateContacts,
  ProjectCreateUpdateContacts,
  ProjectEditUpdateOfficeBefore,
  ProjectCreateUpdateOfficeAfter,
  ProjectCreateUpdateStatisticsAfter,
  testCallback2,
  ProjectEditUpdateHistoryAfter
} from './callbacks/index.js'

extendCollection(Projects, {
  callbacks: {
    create: {
      after: [ProjectCreateSaveToAlgolia, ProjectCreateUpdateContacts, ProjectCreateUpdateOfficeAfter, ProjectCreateUpdateStatisticsAfter]
    },
    update: {
      after: [ProjectEditUpdateContacts, ProjectEditUpdateHistoryAfter],
      before: [ProjectEditUpdateAlgoliaBefore, ProjectEditUpdateOfficeBefore],
      async: [testCallback2]
    }
  }
})
