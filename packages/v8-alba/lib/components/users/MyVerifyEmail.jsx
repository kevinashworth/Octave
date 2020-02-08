import { Components, replaceComponent, withCurrentUser } from 'meteor/vulcan:core'
import { intlShape } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Card, CardBody } from 'reactstrap'

class MyAccountsVerifyEmail extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      pending: true,
      error: null
    }
  }

  componentDidMount () {
    const token = this.props.match.params.token
    // eslint-disable-next-line no-undef
    Accounts.verifyEmail(token, (verifyEmailResult) => {
      if (verifyEmailResult && verifyEmailResult.error) {
        this.setState({
          pending: false,
          error: verifyEmailResult.reason
        })
      } else {
        this.setState({
          pending: false,
          error: null
        })
      }
    })
  }

  render () {
    if (this.state.pending) {
      return <Components.Loading />
    } else if (this.state.error) {
      return (
        <div className='password-reset-form'>
          {this.state.error}
        </div>
      )
    } else {
      return (
        <div className='animated fadeIn page users-edit-form'>
          <Components.HeadTags title={`V8: ${this.context.intl.formatMessage({ id: 'accounts.email_verified' })}`} />
          <Card className='card-accent-success'>
            <CardBody>
              <div className='password-reset-form'>
                {this.context.intl.formatMessage({ id: 'accounts.email_verified' })}
              </div>
              <Components.UsersMenu />
            </CardBody>
          </Card>
        </div>
      )
    }
  }
}

MyAccountsVerifyEmail.contextTypes = {
  intl: intlShape
}

MyAccountsVerifyEmail.propsTypes = {
  currentUser: PropTypes.object,
  match: PropTypes.object.isRequired
}

MyAccountsVerifyEmail.displayName = 'AccountsEnrollAccount'

replaceComponent('AccountsVerifyEmail', MyAccountsVerifyEmail, withCurrentUser, withRouter)
