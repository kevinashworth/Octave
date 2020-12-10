import './methods.js'
import './seed.js'
import './migrations.js'

import './comments/index.js'
import './contacts/index.js'
import './offices/index.js'
import './past-projects/index.js'
import './projects/index.js'
import './users/index.js'

import './emails/index.js'

import './log.js'

// Uncomment after significant changes, otherwise leave commented out:
// import { initializeAlgolia } from './algolia/algolia-initialize.js'
// Meteor.startup(() => {
//   initializeAlgolia()
// })

// import { WebApp } from 'meteor/webapp'

// WebApp.connectHandlers.use('/__coverage__', (req, res, next) => {
//   if (global.__coverage__ && req.method === 'GET') {
//     res.writeHead(200, { 'Content-Type': 'text/json' })
//     res.write(JSON.stringify({ coverage: global.__coverage__ }))
//     res.end()
//   }
// })
