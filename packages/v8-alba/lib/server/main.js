let mongoPassword = Meteor.settings.private.mlabpass
let mongoUsername = Meteor.settings.private.mlabuser
process.env.MONGO_URL = 'mongodb://' + mongoUsername + ':' + mongoPassword + '@ds163769.mlab.com:63769/v8-alba-mlab'

import '../modules/index.js'
import './seed.js'
import './migrations.js'
