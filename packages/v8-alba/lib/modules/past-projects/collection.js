import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

import {
  PastProjectEditUpdateContacts,
  PastProjectEditUpdateOfficeBefore,
  PastProjectCreateUpdateStatisticsAsync,
  PastProjectUpdateStatusAsync
} from './callbacks/index.js'

const PastProjects = createCollection({
  collectionName: 'PastProjects',
  typeName: 'PastProject',
  schema,
  resolvers: getDefaultResolvers('PastProjects'),
  mutations: getDefaultMutations('PastProjects'),
  permissions: {
    canCreate: ['members'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['owners', 'admins']
  },
  callbacks: {
    create: {
      after: [PastProjectEditUpdateContacts],
      async: [PastProjectCreateUpdateStatisticsAsync]
    },
    update: {
      after: [PastProjectEditUpdateContacts],
      async: [PastProjectUpdateStatusAsync],
      before: [PastProjectEditUpdateOfficeBefore]
    }
  }
})

export default PastProjects
