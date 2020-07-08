import { extendCollection } from 'meteor/vulcan:core'
import schema from './schema.js'
import Users from 'meteor/vulcan:users'

Users.createGroup('participants')
Users.createGroup('pending')

extendCollection(Users, {
  schema
})

export default Users
