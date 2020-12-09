import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

export const Offices = createCollection({
  typeName: 'Office',
  collectionName: 'Offices',
  schema,
  resolvers: getDefaultResolvers('Offices'),
  mutations: getDefaultMutations('Offices'),
  permissions: {
    canCreate: ['editors', 'admins'],
    canRead: ['guests'],
    canUpdate: ['editors', 'admins'],
    canDelete: ['owners', 'admins']
  }
})

export default Offices
