import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'
import './callbacks.js'
import './fragments.js'
import './permissions.js'

const Offices = createCollection({
  collectionName: 'Offices',
  typeName: 'Office',
  schema,
  resolvers: getDefaultResolvers('Offices'),
  mutations: getDefaultMutations('Offices')
})

// default sort
Offices.addDefaultView(terms => {
  return {
    options: { sort: { displayName: 1 } }
  }
})

export default Offices
