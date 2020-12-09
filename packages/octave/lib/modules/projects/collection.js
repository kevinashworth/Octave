import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

export const Projects = createCollection({
  collectionName: 'Projects',
  typeName: 'Project',
  schema,
  resolvers: getDefaultResolvers('Projects'),
  mutations: getDefaultMutations('Projects'),
  permissions: {
    canCreate: ['editors', 'admins'],
    canRead: ['guests'],
    canUpdate: ['editors', 'admins'],
    canDelete: ['owners', 'admins']
  },
  defaultInput: {
    sort: {
      updatedAt: 'desc'
    }
  }
})

export default Projects
