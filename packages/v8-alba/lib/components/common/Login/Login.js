import { registerComponent, Components } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'

class Login extends Component {
  render () {
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Login/Logout' />
        <Row className='justify-content-center'>
          <Col md='6'>
            <Card className='p-4'>
              <CardBody>
                <Form>
                  <h1>Sign In / Sign Up</h1>
                  <p className='text-muted'>Access your V8 account</p>
                  <Components.AccountsLoginForm onSignedInHook={() => window.location.assign('/dashboard')} />
                </Form>
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
