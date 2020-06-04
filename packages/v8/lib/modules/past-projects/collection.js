import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

export const PastProjects = createCollection({
  collectionName: 'PastProjects',
  typeName: 'PastProject',
  schema,
  resolvers: getDefaultResolvers('PastProjects'),
  mutations: getDefaultMutations('PastProjects'),
  permissions: {
    canCreate: ['admins'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['admins']
  }
})

export default PastProjects
