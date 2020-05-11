import { registerSetting } from 'meteor/vulcan:lib'

import '../redux/redux.js'

import './components.js'
import './routes.js'
import './i18n.js'

import './comments'
import './contacts'
import './offices'
import './projects'
import './past-projects'
import './statistics'
import './users'
import './patches'

// See https://stackoverflow.com/questions/14342848/how-do-i-access-process-env-in-meteor
// if (Meteor.isClient) {
//   Meteor.call('getProcessEnvMongoUrl', function (err, results) {
//     if (err) {
//       console.error('getProcessEnvMongoUrl[index] error:', err)
//     }
//     console.info('process.env.MONGO_URL:', results)
//   })
// }
// if (Meteor.isServer) {
//   Meteor.methods({
//     getProcessEnvMongoUrl: function () {
//       var mongoURL = process.env.MONGO_URL
//       return mongoURL
//     }
//   })
// }

// `true`/ `false` to show / hide UsersGroups
registerSetting('myDebug', false, 'Show UsersGroups')
