import { registerSetting } from 'meteor/vulcan:lib'

import '../redux/redux.js'

import './i18n.js'
import './components.js'
import './routes.js'

import './comments'
import './contacts'
import './offices'
import './projects'
import './past-projects'
import './statistics'
import './users'
import './patches'

import { setMongoProvider } from './helpers.js'

setMongoProvider()

// `true`/ `false` to show / hide UsersGroups
registerSetting('myDebug', false, 'Show UsersGroups')
