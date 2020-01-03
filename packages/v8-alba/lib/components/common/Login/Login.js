import { registerComponent, Components } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'

class Login extends Component {
  render () {
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Login/Logout' />
        <Row className='justify-content-center'>
          <Col md='6'>
            <Card className='p-4'>
              <CardBody>
                <Components.AccountsLoginForm onSignedInHook={() => window.location.assign('/dashboard')}/>
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
