// import { Accounts } from 'meteor/accounts-base'
import { Components, getFragment, registerComponent, withCurrentUser, withMessages, withSingle2 } from 'meteor/vulcan:core'
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n'
import Users from 'meteor/vulcan:users'
import { STATES } from 'meteor/vulcan:accounts'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardTitle, Col, Row } from 'reactstrap'

class UsersEditForm extends PureComponent {
  constructor (props) {
    super(props)
    this.sendVerificationEmail = this.sendVerificationEmail.bind(this)
  }

  sendVerificationEmail () {
    Meteor.call('sendVerificationEmail', this.props.document._id, this.props.flash, function (err, results) {
      if (err) {
        console.error('sendVerificationEmail error:', err)
      }
      console.info('sendVerificationEmail results:', results)
    })
  }

  render () {
    const { document: user, currentUser, flash, history, loading, toggle } = this.props

    if (loading) {
      return <Components.Loading />
    }

    return Users.canUpdate({ collection: Users, document: user, user: currentUser }) ? (
      <div className='animated fadeIn page users-edit-form'>
        <Components.HeadTags title={`V8: ${this.context.intl.formatMessage({ id: 'users.edit_account' })}`} />
        <Card className='card-accent-success'>
          <CardBody>
            <CardTitle>{user.displayName}</CardTitle>
              <hr />
              <Row>
                <Col>
                  {user.handles &&
                    user.handles.length > 0 &&
                    <CardTitle><b>Emails</b></CardTitle>}
                  {user.handles &&
                    user.handles.map(handle => <Components.EmailDetail key={handle.address} handle={handle} />)
                  }
                  <Components.ModalTrigger title='New Email' component={<Button>Add an Email</Button>}>
                    <Components.EmailNewForm user={user} />
                  </Components.ModalTrigger>
              </Col>
            </Row>
            <Row>
              <Col>
                <Components.ModalTrigger
                  title={<FormattedMessage id='accounts.change_password' />}
                  component={
                    <Button className='btn-warning'>
                      <FormattedMessage id='accounts.change_password' />
                    </Button>
                  }
                >
                  <Components.AccountsLoginForm formState={STATES.PASSWORD_CHANGE} />
                </Components.ModalTrigger>
              </Col>
            </Row>
            <hr />
            <Components.SmartForm
              documentId={user._id}
              collection={Users}
              queryFragment={getFragment('UsersEditFragment')}
              mutationFragment={getFragment('UsersEditFragment')}
              fields={[
                'displayName',
                'username',
                'twitterUsername',
                'bio',
                'website',
                'notifications_comments',
                'notifications_posts',
                'notifications_replies',
                'notifications_users',
                'isAdmin'
              ]}
              successCallback={user => {
                if (toggle) {
                  toggle()
                } else if (user.slug) {
                  history.push(`/users/${user.slug}`)
                } else {
                  history.push('/admin')
                }
                flash({ id: 'users.edit_success', properties: { name: Users.getDisplayName(user) }, type: 'success' })
              }}
              cancelCallback={document => {
                if (toggle) {
                  toggle()
                } else {
                  history.push(`/users/${user.slug}`)
                }
              }}
              showRemove
            />
          </CardBody>
        </Card>
      </div>
    ) : (
      <FormattedMessage id='app.noPermission' />
    )
  }
}

UsersEditForm.propTypes = {
  terms: PropTypes.object // a user is defined by its unique _id or its unique slug
}

UsersEditForm.contextTypes = {
  intl: intlShape
}

UsersEditForm.displayName = 'UsersEditForm'

const options = {
  collection: Users,
  fragmentName: 'UsersProfile'
}

registerComponent({
  name: 'UsersEditForm',
  component: UsersEditForm,
  hocs: [withMessages, withCurrentUser, withRouter, [withSingle2, options]]
})
