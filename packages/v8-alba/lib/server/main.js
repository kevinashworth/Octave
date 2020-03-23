export * from '../modules/index.js';

import './methods.js'
import './migrations.js'
import './seed.js'

import './comments/index.js'
import './contacts/index.js'
import './offices/index.js'
import './past-projects/index.js'
import './projects/index.js'
import './users/index.js'

import './emails/index.js'


// Meteor.call('getProcessEnvMongoUrl', function (err, results) {
//   if (err) {
//     console.error('getProcessEnvMongoUrl[main] error:', err)
//   }
//   if (results.indexOf('v8-alba-mlab') > 0) {
//     import './algolia.js'
//   }
// })

// import Contacts from '../modules/contacts/collection.js'

// Contacts.rawCollection().createIndex({ lastName: 1 })
