import { createCollection } from 'meteor/vulcan:core'
import schema from './schema.js'

const Algolia = createCollection({
  typeName: 'AlgoliaLog',
  collectionName: 'AlgoliaLogs',
  schema,
  permissions: {
    canCreate: ['members'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['owners', 'admins']
  }
})

export default Algolia
