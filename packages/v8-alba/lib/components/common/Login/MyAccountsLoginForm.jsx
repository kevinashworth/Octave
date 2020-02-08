import { Components, replaceComponent } from 'meteor/vulcan:core'
import React, { Component } from 'react'

// let browserHistory
// try {
//   browserHistory = require('react-router').browserHistory
// } catch(e) {
//   // swallow errors
// }

// const onSignedInHook = (redirect) => {
//   if (Meteor.isClient) {
//     if (window.history) {
//       Meteor.setTimeout(() => {
//         if (browserHistory) {
//           browserHistory.push(redirect)
//         } else {
//           window.history.pushState( {} , 'redirect', redirect )
//         }
//       }, 100)
//     }
//   }
// }

// const options = {
//   homeRoutePath: '/latest',
//   onSignedInHook: onSignedInHook('/dashboard'),
//   requireEmailVerification: true
// }

export class MyAccountsLoginForm extends Component {
  componentDidMount () {
    if (document.getElementById('facebook')) {
      document.getElementById('facebook').innerHTML = '<span>Facebook</span>'
    }
    if (document.getElementById('github')) {
      document.getElementById('github').innerHTML = '<span>Github</span>'
    }
  }

  render () {
    return (
      <Components.AccountsStateSwitcher {...this.props} />
    )
  }
}

replaceComponent('AccountsLoginForm', MyAccountsLoginForm)
