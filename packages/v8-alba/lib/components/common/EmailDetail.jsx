import { Components, registerComponent, withMessages } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Card, CardBody, Col, Row } from 'reactstrap'

class EmailDetail extends PureComponent {
  constructor (props) {
    super(props)
    this.emailEditSuccessCallback = this.emailEditSuccessCallback.bind(this)
    this.sendVerificationEmail = this.sendVerificationEmail.bind(this)
  }

  emailEditSuccessCallback ({ address }) {
    this.props.flash({
      id: 'users.add_email_success',
      properties: { address },
      type: 'success'
    })
  }

  sendVerificationEmail () {
    Meteor.call(
      'sendVerificationEmail',
      {
        userId: this.props.user._id,
        email: this.props.user.emailAddress
      },
      (error, results) => {
      if (error) {
        console.error('sendVerificationEmail error:', error)
        this.props.flash(error.reason, 'error')
        return
      }
      // console.info('sendVerificationEmail results:', rmapEmailsCurrentUseresults)
      this.props.flash({
        id: 'users.verify_email_sent',
        properties: { address: this.props.user.emailAddress },
        type: 'primary'
      })
    })
  }


  render () {
    const { user } = this.props
    if (!user) {
      return <FormattedMessage id='app.missing_document' />
    }
    return (
      <Card>
        <CardBody>
          <Row>
            <Col xs>
              <strong>{user.emailAddress}&nbsp;</strong>
              {user.emailPrimary && <span className='text-success'>&nbsp;(<FormattedMessage id='users.primary_email' />)&nbsp;</span> }
            </Col>
            <Col xs='auto'>
              <ButtonGroup>
                <Components.ModalTrigger
                component={<Button color='ghost-secondary'><i className='fa fa-pencil-square-o' /></Button>}>
                  <Components.EmailEditForm user={user} successCallback={this.emailEditSuccessCallback} />
                </Components.ModalTrigger>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <ul className='custom-list'>
                <li>{user.emailVerified
                  ? <FormattedMessage id='users.verified' />
                  : <>
                      <span className='text-warning'>
                        <strong><FormattedMessage id='users.unverified' /></strong>&nbsp;
                      </span>
                      &nbsp;
                      <a href='#' onClick={this.sendVerificationEmail}>
                        <FormattedMessage id='users.verify_email' />
                      </a>
                    </>}
                </li>
              </ul>
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

EmailDetail.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
    emailPrimary: PropTypes.bool,
    emailVerified: PropTypes.bool
  })
}

registerComponent({
  name: 'EmailDetail',
  component: EmailDetail,
  hocs: [withMessages]
})
