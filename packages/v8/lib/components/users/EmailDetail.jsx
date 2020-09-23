import { registerComponent, withMessages } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import findIndex from 'lodash/findIndex'
import log from 'loglevel'

const EmailDetail = ({ flash, user }) => {
  log.debug('EmailDetail:', user.email, user.emails)
  const primaryIndex = findIndex(user.emails, o => o.address === user.email)
  const handleVerificationEmail = () => {
    Meteor.call(
      'sendVerificationEmail',
      {
        userId: user._id,
        email: user.email
      },
      (error, results) => {
        if (error) {
          log.error('handleVerificationEmail error:', error)
          flash(error.reason, 'error')
          return
        }
        log.debug('handleVerificationEmail returned without error,', user.email)
        flash({
          id: 'users.verify_email_sent',
          properties: { address: user.email },
          type: 'primary'
        })
      }
    )
  }

  const GithubInfo = ({ github }) => {
    return (
      <Row>
        <Col>
          <strong>{github.email}</strong>
          <span className='text-success pl-2'>({github.username} on GitHub)</span>
        </Col>
      </Row>
    )
  }

  const EmailInfo = ({ email, primary }) => {
    return (
      <>
        <Row>
          <Col>
            <strong>{email.address}</strong>
            {primary &&
              <span className='text-success pl-2'>(<FormattedMessage id='users.primary_email' />)</span>}
          </Col>
        </Row>
        <Row>
          <Col>
            <ul className='custom-list'>
              <li>
                {email.verified
                  ? <FormattedMessage id='users.verified' />
                  : <Unverified />}
              </li>
            </ul>
          </Col>
        </Row>
      </>
    )
  }

  const Unverified = () => {
    return (
      <>
        <span className='text-warning'>
          <strong><FormattedMessage id='users.unverified' /></strong>
        </span>
        <a href='#' onClick={handleVerificationEmail} className='pl-2'>
          <FormattedMessage id='users.verify_email' />
        </a>
      </>
    )
  }

  if (!user) {
    return <FormattedMessage id='app.missing_document' />
  }
  return (
    <Card>
      <Card.Body>
        {user.emails
          ? user.emails.map((email, index) => <EmailInfo key={`EmailInfo${index}`} email={email} primary={index === primaryIndex} />)
          : <GithubInfo github={user.services.github} />}
      </Card.Body>
    </Card>
  )
}

EmailDetail.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    emails: PropTypes.arrayOf(PropTypes.shape({
      address: PropTypes.string.isRequired,
      verified: PropTypes.bool.isRequired,
      primary: PropTypes.bool
    }))
  })
}

registerComponent({
  name: 'EmailDetail',
  component: EmailDetail,
  hocs: [withMessages]
})
