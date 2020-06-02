import { Accounts } from 'meteor/accounts-base'
import { Components, replaceComponent } from 'meteor/vulcan:core'
import { intlShape } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'

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
      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title='V8: Verification Pending' />
          <Card className='card-accent-success'>
            <Card.Body>
              <Components.Loading />
            </Card.Body>
          </Card>
        </div>
      )
    } else if (this.state.error) {
      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title='V8: Verification Error' />
          <Card className='card-accent-success'>
            <Card.Body>
              {this.state.error}
            </Card.Body>
          </Card>
        </div>
      )
    } else {
      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title={`V8: ${this.context.intl.formatMessage({ id: 'accounts.email_verified' })}`} />
          <Card className='card-accent-success'>
            <Card.Body>
              {this.context.intl.formatMessage({ id: 'accounts.email_verified' })}
              <Components.UsersMenu />
            </Card.Body>
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
  match: PropTypes.object.isRequired
}

MyAccountsVerifyEmail.displayName = 'AccountsEnrollAccount'

replaceComponent({
  name: 'AccountsVerifyEmail',
  component: MyAccountsVerifyEmail,
  hocs: [withRouter]
})
