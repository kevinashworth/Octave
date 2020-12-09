import { Accounts } from 'meteor/accounts-base'
import { Components, replaceComponent } from 'meteor/vulcan:core'
import { intlShape } from 'meteor/vulcan:i18n'
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'
import { useEffectOnce } from '../../hooks'

const MyAccountsVerifyEmail = (props, context) => {
  const [pending, setPending] = useState(true)
  const [error, setError] = useState(null)
  const token = props.match.params.token

  useEffectOnce(() => {
    Accounts.verifyEmail(token, (verifyEmailResult) => {
      if (verifyEmailResult && verifyEmailResult.error) {
        setPending(false)
        setError(verifyEmailResult.reason)
      } else {
        setPending(false)
        setError(null)
      }
    })
  })

  if (error) {
    return (
      <div className='animated fadeIn'>
        <Components.MyHeadTags title='Verification Error' />
        <Alert variant='danger'>{error}</Alert>
      </div>
    )
  }
  if (pending) {
    <div className='animated fadeIn'>
      <Components.MyHeadTags title='Verification Pending' />
      <Components.Loading />
    </div>
  }
  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title='Verification Complete' />
      <Alert variant='success'>
        {context.intl.formatMessage({ id: 'accounts.email_verified' })}
      </Alert>
    </div>
  )
}

MyAccountsVerifyEmail.contextTypes = {
  intl: intlShape
}

MyAccountsVerifyEmail.propsTypes = {
  match: PropTypes.object.isRequired
}

MyAccountsVerifyEmail.displayName = 'AccountsEnrollAccount'

replaceComponent({
  name: 'AccountsVerifyEmail',
  component: MyAccountsVerifyEmail,
  hocs: [withRouter]
})
