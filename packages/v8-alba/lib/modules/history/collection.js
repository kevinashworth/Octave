import { createCollection } from 'meteor/vulcan:core'
import schema from './schema.js'

const History = createCollection({
  typeName: 'History',
  collectionName: 'Histories',
  schema,
  permissions: {
    canCreate: ['members'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['owners', 'admins']
  }
})

export default History
