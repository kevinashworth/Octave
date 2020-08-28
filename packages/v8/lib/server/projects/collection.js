import { extendCollection } from 'meteor/vulcan:core'
import { Projects } from '../../modules/projects/collection.js'
import {
  createAlgoliaObject,
  updateAlgoliaObject,
  ProjectEditUpdateContacts,
  ProjectCreateUpdateContacts,
  ProjectEditUpdateOfficesBefore,
  ProjectCreateUpdateOfficesAfter,
  ProjectCreateUpdateStatisticsAfter,
  ProjectEditUpdateStatusAfter,
  ProjectEditUpdateHistoryAfter
} from './callbacks/index.js'

extendCollection(Projects, {
  callbacks: {
    create: {
      after: [
        ProjectCreateUpdateContacts,
        ProjectCreateUpdateOfficesAfter,
        ProjectCreateUpdateStatisticsAfter
      ],
      async: [
        createAlgoliaObject
      ]
    },
    update: {
      before: [
        ProjectEditUpdateOfficesBefore
      ],
      after: [
        ProjectEditUpdateContacts,
        ProjectEditUpdateHistoryAfter,
        ProjectEditUpdateStatusAfter
      ],
      async: [
        updateAlgoliaObject
      ]
    }
  }
})

Projects.rawCollection().createIndex({ updatedAt: -1 })
