import '../modules/index.js'
import './logger.js'

document.body.classList.add('app')
document.body.classList.add('sidebar-fixed')

Meteor.startup(() => {
  window.readyForCypress = true
})
