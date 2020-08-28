import React from 'react'
import { Components } from 'meteor/vulcan:core'
import { Accounts } from 'meteor/accounts-base'
import { STATES } from './helpers.js'

export class MyAccountsStateSwitcher extends React.Component {
  // constructor(props) {
  //   super(props)

  //   this.state = {
  //     formState: props.formState
  //   }
  // }

  switchToSignUp = (event) => {
    event && event.preventDefault()
    // this.setState({
    //   formState: STATES.SIGN_UP,
    // })
    this.props.onFormStateChange(STATES.SIGN_UP)
    // this.clearMessages()
  }

  switchToSignIn = (event) => {
    event && event.preventDefault()
    // this.setState({
    //   formState: STATES.SIGN_IN,
    // })
    this.props.onFormStateChange(STATES.SIGN_IN)

    // this.clearMessages()
  }

  switchToPasswordReset = (event) => {
    event && event.preventDefault()
    // this.setState({
    //   formState: STATES.PASSWORD_RESET,
    // })
    this.props.onFormStateChange(STATES.PASSWORD_RESET)
    // this.clearMessages()
  }

  switchToChangePassword = (event) => {
    event && event.preventDefault()
    // this.setState({
    //   formState: STATES.PASSWORD_CHANGE,
    // })
    this.props.onFormStateChange(STATES.PASSWORD_CHANGE)
    // this.clearMessages()
  }

  switchToSignOut = (event) => {
    event && event.preventDefault()
    // this.setState({
    //   formState: STATES.PROFILE,
    // })
    this.props.onFormStateChange(STATES.PROFILE)
    // this.clearMessages()
  }

  cancelResetPassword = (event) => {
    event && event.preventDefault()
    Accounts._loginButtonsSession.set('resetPasswordToken', null)
    // this.setState({
    //   formState: STATES.SIGN_IN,
    // })
    this.props.onFormStateChange(STATES.SIGN_IN)
    // this.clearMessages()
  }

  switchToProfile = (event) => {
    event && event.preventDefault()
    // this.setState({
    //   formState: STATES.PROFILE,
    // })
    this.props.onFormStateChange(STATES.PROFILE)
    // this.clearMessages()
  }

  render () {
    // const { formState } = this.props
    const {
      switchToSignUp,
      switchToSignIn,
      switchToPasswordReset,
      switchToChangePassword,
      switchToSignOut,
      cancelResetPassword,
      switchToProfile
    } = this

    const handlers = {
      switchToSignUp,
      switchToSignIn,
      switchToPasswordReset,
      switchToChangePassword,
      switchToSignOut,
      cancelResetPassword,
      switchToProfile
    }
    return (
      <Components.AccountsLoginFormInner {...this.props} handlers={handlers} />
    )
  }
}

// export const MyAccountsStateSwitcher = React.forwardRef((props, ref) => (
//   <MyStateSwitcher ref={ref} {...props} />
// ))

// replaceComponent('AccountsStateSwitcher', MyAccountsStateSwitcher)
