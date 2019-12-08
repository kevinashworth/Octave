import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

import {
  OfficeEditUpdateContacts,
  OfficeEditUpdatePastProjects,
  OfficeEditUpdateProjects
} from './callbacks/index.js';

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
    canDelete: ['owners', 'admins'],
  },
  callbacks: {
    // create: {
    //   validate: [(validationErrors, properties) => { return validationErrors; }],
    //   before: [(document, properties) => { return document; }],
      after: [OfficeEditUpdateContacts, OfficeEditUpdatePastProjects, OfficeEditUpdateProjects],
    //   async: [(properties) => { /* no return value */ }],
    // },
    update: {
      // validate: [(validationErrors, properties) => { return validationErrors; }],
      before: [OfficeEditUpdateContacts],
      after: [OfficeEditUpdatePastProjects, OfficeEditUpdateProjects],
      // async: [(properties) => { /* no return value */ }],
    },
    // delete: {
    //   validate: [(validationErrors, properties) => { return validationErrors; }],
    //   before: [(document, properties) => { return document; }],
    //   after: [(document, properties) => { return document; }],
    //   async: [(properties) => { /* no return value */ }],
    // }
  },
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
