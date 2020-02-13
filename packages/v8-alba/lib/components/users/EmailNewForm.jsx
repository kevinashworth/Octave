import { Meteor } from 'meteor/meteor'
// import { Accounts } from 'meteor/accounts-base'
import { Components, registerComponent } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
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

  handleClick () {
    this.addEmail()
    if (this.props.toggle) {
      this.props.toggle()
    }
  }

  addEmail () {
    console.log('EmailNewForm addEmail:')
    console.log(this.props.user._id)
    console.log(this.state.value)
    Meteor.wrapAsync(Meteor.call('addEmail', {
      userId: this.props.user._id,
      newEmail: this.state.value
    }, (err, res) => {
      if (err) {
        console.error('await addEmail error:', err)
      }
      console.info('await addEmail has returned')

      const freshUser = Users.findOne(this.props.user._id)
      Meteor.wrapAsync(Meteor.call('mapEmails', {
        user: freshUser
      }, (err, res) => {
        if (err) {
          console.error('await mapEmails error:', err)
        }
        console.info('await mapEmails has returned')
      }))
    }))
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
