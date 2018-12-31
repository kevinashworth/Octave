import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'
import './fragments.js'
import './permissions.js'
import './callbacks.js'

const PastProjects = createCollection({
  collectionName: 'PastProjects',
  typeName: 'PastProject',
  schema,
  resolvers: getDefaultResolvers('PastProjects'),
  mutations: getDefaultMutations('PastProjects')
})

PastProjects.addDefaultView(terms => {
  return {
    options: { sort: { updatedAt: -1 } }
  }
})

PastProjects.addView('collectionWithStatus', terms => ({
  selector: {
    status: terms.status
  }
}))

export default PastProjects
