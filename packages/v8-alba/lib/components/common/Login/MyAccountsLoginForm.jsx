import { Components, replaceComponent } from 'meteor/vulcan:core'
import React, { Component } from 'react'

export class MyAccountsLoginForm extends Component {
  render () {
    return (
      <Components.AccountsStateSwitcher {...this.props} />
    )
  }
}

replaceComponent('AccountsLoginForm', MyAccountsLoginForm)
