import { createCollection } from 'meteor/vulcan:core'
import schema from './schema.js'

const Statistics = createCollection({
  typeName: 'Statistic',
  collectionName: 'Statistics',
  schema,
  permissions: {
    canCreate: ['members'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['owners', 'admins'],
  }
})

// default sort by createdAt timestamp in descending order
Statistics.addDefaultView(terms => {
  return {
    options: { sort: { createdAt: -1 } }
  }
})

export default Statistics
