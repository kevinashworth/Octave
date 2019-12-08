import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

import {
  ProjectEditUpdateContacts,
  ProjectEditUpdateOfficeAfter,
  ProjectEditUpdateOfficeBefore,
  ProjectCreateUpdateStatisticsAsync,
  ProjectUpdateStatusAsync
} from './callbacks/index.js'

const Projects = createCollection({
  collectionName: 'Projects',
  typeName: 'Project',
  schema,
  resolvers: getDefaultResolvers('Projects'),
  mutations: getDefaultMutations('Projects'),
  permissions: {
    canCreate: ['members'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['owners', 'admins']
  },
  callbacks: {
    create: {
      after: [ProjectEditUpdateContacts, ProjectEditUpdateOfficeAfter],
      async: [ProjectCreateUpdateStatisticsAsync]
    },
    update: {
      after: [ProjectEditUpdateContacts],
      before: [ProjectEditUpdateOfficeBefore],
      async:  [ProjectUpdateStatusAsync]
    }
  }
})

export default Projects
