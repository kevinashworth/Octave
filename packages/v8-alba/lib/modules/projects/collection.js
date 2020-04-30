import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

export const Projects = createCollection({
  collectionName: 'Projects',
  typeName: 'Project',
  schema,
  resolvers: getDefaultResolvers('Projects'),
  mutations: getDefaultMutations('Projects'),
  permissions: {
    canCreate: ['admins'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['admins']
  }
})

export default Projects
