import { Meteor } from 'meteor/meteor'
// import { Accounts } from 'meteor/accounts-base'
import { Components, registerComponent, withMessages } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import SimpleSchema from 'simpl-schema'
import { Button, Card, CardBody, Col, Form, Row } from 'reactstrap'

const singleEmailSchema = new SimpleSchema({
  email: {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.EmailWithTLD
  }
})

class EmailNewForm extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      isInvalid: false,
      validationErrors: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange (event) {
    if (event.target.value && event.target.value.length < 6) { // x@y.zz
      this.setState({
        value: event.target.value,
        isInvalid: false,
        validationErrors: {}
      })
    } else {
      const validationContext = singleEmailSchema.namedContext('EmailNewForm')
      validationContext.validate({ email: event.target.value })
      const isInvalid = !validationContext.isValid()
      this.setState({
        value: event.target.value,
        isInvalid
      })
      const validationErrors = validationContext.validationErrors()
      this.setState({
        validationErrors
      })
    }
  }

  handleClick () {
    if (this.state.isInvalid === false) {
      const userId = this.props.user._id
      const newEmail = this.state.value
      console.log('EmailNewForm addEmail:', userId, newEmail)
      Meteor.call(
        'addEmail',
        {
          userId,
          newEmail
        },
        (error, result) => {
          if (error && error.error === 'already-exists') {
            this.props.flash(error.reason, 'error');
            console.error('addEmail error:', error)
            // addEmailError = error
            return null
          }
          // might there be other errors?
          // if (error && error.error ....)
          if (!error) {
            console.info('addEmail had result', result)
            if (typeof result === 'string' && this.props.successCallback) {
              this.props.successCallback({ handle: result })
            }
            const freshUser = Users.findOne(userId)
            Meteor.call(
              'mapEmails',
              {
                user: freshUser
              },
              (error, result) => {
                if (error) {
                  console.error('mapEmails error:', error.error, error.reason)
                  // addEmailError = error
                  return null
                }
                console.info('mapEmails had no error but result', result)
              }
            )
          }
        }
      )
      if (this.props.toggle) {
        this.props.toggle()
      }
    } else {
      console.log(this.state.validationErrors)
    }
  }

  render () {
    return (
      <div>
        <Card>
          <CardBody>
            <Form>
              <Components.FormControl
                id='email' type='email' placeholder='Email'
                value={this.state.value}
                onChange={this.handleChange}
                invalid={this.state.isInvalid}
                messageId='errors.email_regex' />
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

registerComponent({
  name: 'EmailNewForm',
  component: EmailNewForm,
  hocs: [withMessages]
})
