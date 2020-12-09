import { extendCollection } from 'meteor/vulcan:core'
import schema from './schema.js'
import Users from 'meteor/vulcan:users'

/**
 * permissions hierarchy:
 * members: any user with an account. limited access.
 * pending: [unused]
 * participants: member with approved account. can view all items.
 * editors: can create items.
 * admins: can do all the things.
 */

Users.createGroup('editors')
Users.createGroup('participants')
Users.createGroup('pending')

extendCollection(Users, {
  schema
})

export default Users
