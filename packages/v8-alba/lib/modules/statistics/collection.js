import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'
// import './fragments.js';
// import './permissions.js';

const Statistics = createCollection({
  collectionName: 'Statistics',

  typeName: 'Statistics',

  schema,

  resolvers: getDefaultResolvers('Statistics'),

  mutations: getDefaultMutations('Statistics')

})

// default sort by createdAt timestamp in descending order
Statistics.addDefaultView(terms => {
  return {
    options: { sort: { createdAt: -1 } }
  }
})

export default Statistics
