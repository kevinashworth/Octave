import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'
import './fragments.js'
import './permissions.js'
import './callbacks.js'

const Offices = createCollection({
  collectionName: 'Offices',

  typeName: 'Office',

  schema,

  resolvers: getDefaultResolvers('Offices'),

  mutations: getDefaultMutations('Offices')

})

// default sort by updatedAt timestamp in descending order
Offices.addDefaultView(terms => {
  return {
    options: { sort: { updatedAt: -1 } }
  }
})

export default Offices
