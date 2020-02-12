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

    this.addEmail = this.addEmail.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange (event) {
    this.setState({value: event.target.value})
  }

  handleClick = () => {
    this.addEmail()
    if (this.props.toggle) {
      this.props.toggle()
    }
  }

  addEmail () {
    const { user } = this.props
    console.log('EmailNewForm addEmail:')
    console.log(user._id)
    console.log(this.state.value)
    Meteor.call('addEmail', {
      userId: user._id,
      newEmail: this.state.value
    }, (err, res) => {
      if (err) {
        console.error('addEmail error:', err)
      } else {
        console.info('addEmail has returned, now mapEmails')
        Meteor.call('mapEmails', {
          user: user
        }, (err, res) => {
          if (err) {
            console.error('mapEmails error:', err)
          }
          console.info('mapEmails has returned')
        })
      }
    })
  }

  render () {
    return (
      <div>
        <Card>
          <CardBody>
            <Form>
              <Components.FormControl id='email' type='email' onChange={this.handleChange} placeholder='Email' />
              <Row>
                <Col>
                  <Button color='primary' onClick={this.handleClick}>Submit</Button>
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
