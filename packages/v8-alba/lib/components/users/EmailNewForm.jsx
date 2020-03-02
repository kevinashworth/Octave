import { Meteor } from 'meteor/meteor'
// import { Accounts } from 'meteor/accounts-base'
import { Components, registerComponent, withMessages } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import SimpleSchema from 'simpl-schema'
import { Button, Card, CardBody, Col, Form, Row } from 'reactstrap'

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
    this.isInvalidEmail = this.isInvalidEmail.bind(this)
  }

  isInvalidEmail (email) {
    const singleEmailSchema = new SimpleSchema({
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.EmailWithTLD
      }
    })
    const validationContext = singleEmailSchema.namedContext('EmailNewForm')
    validationContext.validate({ email })
    const isInvalid = !validationContext.isValid()
    const validationErrors = validationContext.validationErrors()
    this.setState({
      validationErrors
    })
    return isInvalid
  }

  handleChange (event) {
    const isInvalid = this.isInvalidEmail(event.target.value)
    this.setState({
      value: event.target.value,
      isInvalid
    })
  }

  handleClick () {
    const isInvalid = this.isInvalidEmail(this.state.value)
    if (isInvalid === false) {
      const userId = this.props.user._id
      const newEmail = this.state.value
      // console.log('EmailNewForm addEmail:', userId, newEmail)
      Meteor.call(
        'addEmail',
        {
          userId,
          newEmail
        },
        (error, result) => {
          if (error && error.error === 'already-exists') {
            this.props.flash(error.reason, 'error');
            // console.error('addEmail error:', error)
            return null
          }
          // might there be other errors?
          // if (error && error.error ....)
          if (!error) {
            console.info('addEmail had result', result)
            if (typeof result === 'string' && this.props.successCallback) {
              this.props.successCallback({ address: result })
            }
            const freshUser = Users.findOne(userId)
            Meteor.call(
              'mapEmails',
              {
                user: freshUser
              },
              (error, result) => {
                if (error) {
                  // console.error('mapEmails error:', error.error, error.reason)
                  return null
                }
              }
            )
          }
        }
      )
      if (this.props.toggle) {
        this.props.toggle()
      }
    } else {
      // console.log(this.state.validationErrors)
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
