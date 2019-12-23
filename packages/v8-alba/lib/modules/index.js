import '../redux/redux.js'

import './components.js'
import './routes.js'
import './i18n.js'

// import './algolia-log'
import './comments'
import './contacts'
import './offices'
import './projects'
import './past-projects'
import './statistics'
import './users'

// export * from './comments/index.js'
// export * from './contacts/index.js'
// export * from './offices/index.js'
// export * from './past-projects/index.js'
// export * from './projects/index.js'
// export * from './statistics/index.js'

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
