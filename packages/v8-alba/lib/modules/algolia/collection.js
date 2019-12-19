import { createCollection } from 'meteor/vulcan:core'
import schema from './schema.js'

const Algolia = createCollection({
  typeName: 'Algolia',
  collectionName: 'Algolia',
  schema,
  permissions: {
    canCreate: ['members'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['owners', 'admins']
  }
})

export default Algolia
