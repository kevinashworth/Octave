import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

import {
  ProjectEditUpdateContacts,
  ProjectCreateUpdateContacts,
  ProjectCreateUpdateOfficeAfter,
  ProjectEditUpdateOfficeBefore,
  ProjectCreateUpdateStatisticsAfter,
  ProjectEditUpdateStatusAfter
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
      after: [ProjectCreateUpdateContacts, ProjectCreateUpdateOfficeAfter, ProjectCreateUpdateStatisticsAfter]
    },
    update: {
      after: [ProjectEditUpdateContacts, ProjectEditUpdateStatusAfter],
      before: [ProjectEditUpdateOfficeBefore]
    }
  }
})

export default Projects
