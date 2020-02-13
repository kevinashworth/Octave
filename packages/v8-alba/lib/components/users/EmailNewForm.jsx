import { Meteor } from 'meteor/meteor'
// import { Accounts } from 'meteor/accounts-base'
import { Components, registerComponent } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
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
    const result = this.addEmail()
    console.log('result:', result)
    if (typeof result === 'string' && this.props.successCallback) {
      this.props.successCallback({ handle: result })
    } else {
      console.log('error:', result.error)
    }
    if (this.props.toggle) {
      this.props.toggle()
    }
  }

  addEmail () {
    const userId = this.props.user._id
    const newEmail = this.state.value
    console.log('EmailNewForm addEmail:', userId, newEmail)

    var addEmailError = {} // because can't just `return` from within `wrapAsync` and `call`

    Meteor.wrapAsync(Meteor.call('addEmail', {
      userId,
      newEmail
    }, (err, res) => {
      if (err) {
        console.error('await addEmail error:', err)
        addEmailError = err
      }
      console.info('await addEmail has returned')

      const freshUser = Users.findOne(userId)

      Meteor.wrapAsync(Meteor.call('mapEmails', {
        user: freshUser
      }, (err, res) => {
        if (err) {
          console.error('await mapEmails error:', err)
          addEmailError = err
        }
        console.info('await mapEmails has returned')
      }))
    }))

    console.log('addEmailError:', addEmailError)

    if (Object.keys(addEmailError).length === 0) {
      return newEmail
    } else {
      return addEmailError
    }
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

EmailNewForm.propTypes = {
  successCallback: PropTypes.func
}

registerComponent('EmailNewForm', EmailNewForm)
