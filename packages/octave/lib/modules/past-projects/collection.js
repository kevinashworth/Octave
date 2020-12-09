import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

export const PastProjects = createCollection({
  collectionName: 'PastProjects',
  typeName: 'PastProject',
  schema,
  resolvers: getDefaultResolvers('PastProjects'),
  mutations: getDefaultMutations('PastProjects'),
  permissions: {
    canCreate: ['editors', 'admins'],
    canRead: ['guests'],
    canUpdate: ['editors', 'admins'],
    canDelete: ['owners', 'admins']
  }
})

export default PastProjects
