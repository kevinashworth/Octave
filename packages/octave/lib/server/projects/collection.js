import { extendCollection } from 'meteor/vulcan:core'
import { Projects } from '../../modules/projects/collection.js'
import {
  createAlgoliaObject,
  updateAlgoliaObject,
  createProjectUpdateContacts,
  updateProjectUpdateContacts,
  // ProjectEditUpdateContacts,
  // ProjectCreateUpdateContacts,
  ProjectCreateUpdateOfficesAfter,
  updateProjectUpdateOffices,
  ProjectCreateUpdateStatisticsAfter,
  ProjectEditUpdateStatusAfter,
  // ProjectEditUpdateHistoryAfter
} from './callbacks/index.js'
import { updatePatches } from '../patches/callback'

extendCollection(Projects, {
  callbacks: {
    create: {
      after: [
        // ProjectCreateUpdateContacts,
        ProjectCreateUpdateOfficesAfter,
        ProjectCreateUpdateStatisticsAfter
      ],
      async: [
        createAlgoliaObject,
        createProjectUpdateContacts
      ]
    },
    update: {
      after: [
        // ProjectEditUpdateContacts,
        // ProjectEditUpdateHistoryAfter,
        ProjectEditUpdateStatusAfter
      ],
      async: [
        updateAlgoliaObject,
        updatePatches,
        updateProjectUpdateContacts,
        updateProjectUpdateOffices
      ]
    }
  }
})

// extendCollection(Projects, {
//   callbacks: {
//     create: {
//       async: [
//         createAlgoliaObject,
//         createProjectUpdateContacts,
//         createProjectUpdateOffices,
//         createProjectUpdateStatistics
//       ]
//     },
//     update: {
//       async: [
//         updateAlgoliaObject,
//         updateProjectUpdateContacts,
//         updateProjectUpdateOffices,
//         updateProjectUpdateStatus,
//         updatePatches
//       ]
//     }
//   }
// })

Projects.rawCollection().createIndex({ updatedAt: -1 })
