import { registerComponent, Components } from 'meteor/vulcan:core'
import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { MyAccountsLoginForm } from './MyAccountsLoginForm.jsx'

const Login = (props) => {
  // lifting up `formState` from AccountsStateSwitcher
  const [formState, setFormState] = useState(Symbol.for('SIGN_IN'))
  const [formHeadings, setFormHeadings] = useState({
    formHeading: 'Sign In / Sign Up',
    formSubheading: 'Access your V8 account'
  })

  const handleFormStateChange = (state) => {
    setFormState(state)
    switch (state) {
      case Symbol.for('SIGN_IN'):
        setFormHeadings({
          formHeading: 'Sign In'
        })
        break
      case Symbol.for('SIGN_UP'):
        setFormHeadings({
          formHeading: 'Sign Up',
          formSubheading: 'Sign up for a V8 account'
        })
        break
      case Symbol.for('PROFILE'):
        setFormHeadings({
          formHeading: 'Logging In',
          formSubheading: 'This will just take a moment'
        })
        break
      case Symbol.for('PASSWORD_CHANGE'):
        setFormHeadings({
          formHeading: 'Change Password'
        })
        break
      case Symbol.for('PASSWORD_RESET'):
        setFormHeadings({
          formHeading: 'Reset Password'
        })
        break
      case Symbol.for('ENROLL_ACCOUNT'):
        setFormHeadings({
          formHeading: 'Enroll Account'
        })
        break
      default:
        setFormHeadings({
          formHeading: 'Enroll Account'
        })
    }
  }

  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8: Login/Logout' />
      <Row className='justify-content-center'>
        <Col md='6'>
          <Card className='p-4'>
            <Card.Body>
              <h1>{formHeadings.formHeading}</h1>
              <p className='text-muted'>{formHeadings.formSubheading}</p>
              <MyAccountsLoginForm
                formState={formState}
                onFormStateChange={handleFormStateChange}
                onSignedInHook={() => window.location.assign('/dashboard')}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

registerComponent({
  name: 'Login',
  component: Login
})
