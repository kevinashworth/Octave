import '../modules/index.js'
// import './seed.js'
import './migrations.js'

// Meteor.call('getProcessEnvMongoUrl', function (err, results) {
//   if (err) {
//     console.error('getProcessEnvMongoUrl[main] error:', err)
//   }
//   if (results.indexOf('v8-alba-mlab') > 0) {
//     import './algolia.js'
//   }
// })

import Contacts from '../modules/contacts/collection.js'

Contacts.rawCollection().createIndex({ lastName: 1 })
