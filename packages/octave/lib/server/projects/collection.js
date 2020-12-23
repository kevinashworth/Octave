import { extendCollection } from 'meteor/vulcan:core'
import { Projects } from '../../modules/projects/collection.js'
import {
  createAlgoliaObject,
  updateAlgoliaObject,
  createProjectUpdateContacts,
  updateProjectUpdateContacts,
  createProjectUpdateOffices,
  updateProjectUpdateOffices,
  createProjectUpdateStatistics,
  updateProjectUpdateStatus
} from './callbacks/index.js'
import { deleteAlgoliaObject, deleteComments } from '../common/callbacks'
import { updatePatches } from '../patches/callback'

extendCollection(Projects, {
  callbacks: {
    create: {
      after: [
        createProjectUpdateStatistics
      ],
      async: [
        createAlgoliaObject,
        createProjectUpdateContacts,
        createProjectUpdateOffices
      ]
    },
    update: {
      after: [
        updateProjectUpdateStatus
      ],
      async: [
        updateAlgoliaObject,
        updatePatches,
        updateProjectUpdateContacts,
        updateProjectUpdateOffices
      ]
    },
    delete: {
      async: [
        deleteAlgoliaObject,
        deleteComments
      ]
    }
  }
})

Projects.rawCollection().createIndex({ updatedAt: -1 })
