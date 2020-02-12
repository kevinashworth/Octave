// import { Accounts } from 'meteor/accounts-base'
import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Button, Card, CardBody, Col, Form, Row } from 'reactstrap'

class EmailNewForm extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      value: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    this.setState({value: event.target.value})
  }

  handleSubmit = () => {
    console.log('addEmail:')
    console.log(this.state.value)
    console.log(this.props.user)
    // Accounts.addEmail(this.props.user._id, this.state.value)
  }

  render () {
    return (
      <div>
        <Card>
          <CardBody>
            <Form onSubmit={this.handleSubmit}>
              <Components.FormControl id='email' type='email' onChange={this.handleChange} placeholder='Email' />
              <Row>
                <Col>
                  <Button color='primary'>Submit</Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    )
  }
}

registerComponent('EmailNewForm', EmailNewForm)
