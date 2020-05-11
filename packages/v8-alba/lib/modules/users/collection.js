import './schema.js'
import './fragments.js' // import after schema for getRequiredFields to find all `mustComplete`

import Users from 'meteor/vulcan:users'

Users.createGroup('participants')

export default Users
