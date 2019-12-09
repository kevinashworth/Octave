import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

import {
  ContactEditUpdateOffices,
  ContactEditUpdateProjects,
  ContactEditUpdatePastProjects
} from './callbacks/index.js'

const Contacts = createCollection({
  typeName: 'Contact',
  collectionName: 'Contacts',
  schema,
  resolvers: getDefaultResolvers('Contacts'),
  mutations: getDefaultMutations('Contacts'),
  permissions: {
    canCreate: ['members'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['owners', 'admins']
  },
  callbacks: {
    create: {
      after: [ContactEditUpdateOffices, ContactEditUpdateProjects, ContactEditUpdatePastProjects]
    },
    update: {
      after: [ContactEditUpdateOffices, ContactEditUpdateProjects, ContactEditUpdatePastProjects]
    }
  }
})

export default Contacts
