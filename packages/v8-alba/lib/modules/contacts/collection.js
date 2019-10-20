import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
import schema from './schema.js'

const Contacts = createCollection({
  collectionName: 'Contacts',
  typeName: 'Contact',
  schema,
  resolvers: getDefaultResolvers('Contacts'),
  mutations: getDefaultMutations('Contacts')
})

export default Contacts
