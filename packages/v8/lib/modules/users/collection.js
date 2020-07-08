import { extendCollection } from 'meteor/vulcan:core'
// import './schema.js'
import './fragments.js' // import after schema for getRequiredFields to find all `mustComplete`
import schema from './schema2.js'
import Users from 'meteor/vulcan:users'

Users.createGroup('participants')
Users.createGroup('pending')

extendCollection(Users, {
  schema
})

export default Users
