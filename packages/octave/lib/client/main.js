import { getSetting } from 'meteor/vulcan:core'
import '../modules/index.js'
import './logger.js'

document.body.classList.add('app')
document.body.classList.add('sidebar-fixed')

Meteor.startup(() => {
  if (getSetting('cypress', false)) {
    window.readyForCypress = true
  }
})
