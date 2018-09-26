import { registerComponent, Components } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'

class Login extends Component {
  render () {
    return (
      <div className='animated fadeIn'>
        <Row className='justify-content-center'>
          <Col md='6'>
            <Card className='p-4'>
              <CardBody>
                <Components.AccountsLoginForm />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

registerComponent('Login', Login)
