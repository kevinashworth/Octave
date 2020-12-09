import React, { Component } from 'react'
import { MyAccountsStateSwitcher } from './MyAccountsStateSwitcher.jsx'

export class MyAccountsLoginForm extends Component {
  componentDidMount () {
    if (document.getElementById('facebook')) {
      document.getElementById('facebook').innerHTML = '<span>Facebook</span>'
    }
    if (document.getElementById('github')) {
      document.getElementById('github').innerHTML = '<span>Github</span>'
    }
  }

  componentDidUpdate () {
    if (document.getElementById('facebook')) {
      document.getElementById('facebook').innerHTML = '<span>Facebook</span>'
    }
    if (document.getElementById('github')) {
      document.getElementById('github').innerHTML = '<span>Github</span>'
    }
  }

  render () {
    return (
      <MyAccountsStateSwitcher {...this.props} />
    )
  }
}
