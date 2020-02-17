import { registerComponent, Components } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { MyAccountsLoginForm } from './MyAccountsLoginForm.jsx'

class Login extends Component {
  constructor(props) {
    super(props)
    // lifting state up from AccountsStateSwitcher
    this.state = {
      formState: null,
      formHeading: 'Sign In',
      formSubheading: 'Access your V8 account'
    }
    this.onFormStateChange = this.onFormStateChange.bind(this)
  }

  onFormStateChange = (state) => {
    var formHeading, formSubheading
    switch(state) {
      case Symbol.for('SIGN_IN'):
        formHeading = 'Sign In'
        break
      case Symbol.for('SIGN_UP'):
        formHeading = 'Sign Up'
        formSubheading = 'Sign up for a V8 account'
        break
      case Symbol.for('PROFILE'):
        formHeading = 'Logging In'
        formSubheading = 'This will just take a moment'
        break
      case Symbol.for('PASSWORD_CHANGE'):
        formHeading = 'Change Password'
        break
      case Symbol.for('PASSWORD_RESET'):
        formHeading = 'Reset Password'
        break
      case Symbol.for('ENROLL_ACCOUNT'):
        formHeading = 'Enroll Account'
        break
      default:
        formHeading = 'Sign In / Sign Up'
        formSubheading = 'Access your V8 account'
    }
    this.setState({
      formState: state,
      formHeading,
      formSubheading
    })
  }

  render () {
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8: Login/Logout' />
        <Row className='justify-content-center'>
          <Col md='6'>
            <Card className='p-4'>
              <CardBody>
                <h1>{this.state.formHeading}</h1>
                <p className='text-muted'>{this.state.formSubheading}</p>
                <MyAccountsLoginForm
                  formState={this.state.formState}
                  onFormStateChange={this.onFormStateChange}
                  onSignedInHook={() => window.location.assign('/dashboard')}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

registerComponent({
  name: 'Login',
  component: Login
})
