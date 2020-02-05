import { Components, replaceComponent } from 'meteor/vulcan:core'
import React, { Component } from 'react'

export class MyAccountsLoginForm extends Component {
  componentDidMount() {
    document.getElementById('facebook').innerHTML = '<span>Facebook</span>'
    document.getElementById('github').innerHTML = '<span>Github</span>'
  }
  
  render () {
    return (
      <Components.AccountsStateSwitcher {...this.props} />
    )
  }
}

replaceComponent('AccountsLoginForm', MyAccountsLoginForm)
