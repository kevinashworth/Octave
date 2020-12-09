import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

export const Contacts = createCollection({
  typeName: 'Contact',
  collectionName: 'Contacts',
  schema,
  resolvers: getDefaultResolvers('Contacts'),
  mutations: getDefaultMutations('Contacts'),
  permissions: {
    canCreate: ['editors', 'admins'],
    canRead: ['guests'],
    canUpdate: ['editors', 'admins'],
    canDelete: ['owners', 'admins']
  }
})

export default Contacts
