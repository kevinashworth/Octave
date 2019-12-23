import { extendCollection } from 'meteor/vulcan:core'
import { Projects } from '../../modules/projects/collection.js'
import {
  ProjectEditUpdateContacts,
  ProjectCreateUpdateContacts,
  ProjectCreateUpdateOfficeAfter,
  ProjectEditUpdateOfficeBefore,
  ProjectCreateUpdateStatisticsAfter,
  ProjectEditUpdateStatusAfter
} from './callbacks/index.js'

extendCollection(Projects, {
  callbacks: {
    create: {
      after: [ProjectCreateUpdateContacts, ProjectCreateUpdateOfficeAfter, ProjectCreateUpdateStatisticsAfter]
    },
    update: {
      after: [ProjectEditUpdateContacts, ProjectEditUpdateStatusAfter],
      before: [ProjectEditUpdateOfficeBefore]
    }
  }
})
