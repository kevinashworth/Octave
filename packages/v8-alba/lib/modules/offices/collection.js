import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

import {
  OfficeEditUpdateContacts,
  OfficeEditUpdatePastProjects,
  OfficeEditUpdateProjects
} from './callbacks/index.js'

const Offices = createCollection({
  typeName: 'Office',
  collectionName: 'Offices',
  schema,
  resolvers: getDefaultResolvers('Offices'),
  mutations: getDefaultMutations('Offices'),
  permissions: {
    canCreate: ['members'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['owners', 'admins']
  },
  callbacks: {
    create: {
      after: [OfficeEditUpdateContacts, OfficeEditUpdatePastProjects, OfficeEditUpdateProjects]
    },
    update: {
      before: [OfficeEditUpdateContacts],
      after: [OfficeEditUpdatePastProjects, OfficeEditUpdateProjects]
    }
  }
})

Offices.addDefaultView(terms => ({
  options: {
    sort: { displayName: 1 }
  }
}))

Offices.addView('officesByUpdated', terms => ({
  options: {
    sort: { updatedAt: -1 }
  }
}))

export default Offices
