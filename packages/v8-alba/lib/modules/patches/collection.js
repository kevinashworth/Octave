import { createCollection } from 'meteor/vulcan:core'
import schema from './schema.js'

const Patches = createCollection({
  typeName: 'Patch',
  collectionName: 'Patches',
  schema,
  permissions: {
    canCreate: ['members'],
    canRead: ['guests'],
    canUpdate: ['owners', 'admins'],
    canDelete: ['owners', 'admins']
  }
})

export default Patches
