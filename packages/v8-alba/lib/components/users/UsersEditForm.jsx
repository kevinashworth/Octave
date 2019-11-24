import { Components, getFragment, registerComponent, withCurrentUser, withMessages } from 'meteor/vulcan:core'
import { STATES } from 'meteor/vulcan:accounts'
import Users from 'meteor/vulcan:users'
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

const UsersEditForm = ({ currentUser, flash, history, networkStatus, terms, toggle, user }, context) => {
  console.group('UsersEditForm:')
  console.log('flash:', flash)
  console.log('history:', history)
  console.log('terms:', terms)
  console.log('toggle:', toggle)
  console.groupEnd()

  return Users.canUpdate({ collection: Users, document: user, user: currentUser }) ? (
    <div className='page users-edit-form'>
      <h2 className='page-title users-edit-form-title'><FormattedMessage id='users.edit_account' /></h2>

      <div className='change-password-link'>
        <Components.ModalTrigger size='small' title={context.intl.formatMessage({ id: 'accounts.change_password' })} component={<a href='#'><FormattedMessage id='accounts.change_password' /></a>}>
          <Components.AccountsLoginForm formState={STATES.PASSWORD_CHANGE} />
        </Components.ModalTrigger>
      </div>

      <Components.SmartForm
        collection={Users}
        {...terms}
        mutationFragment={getFragment('UsersEditFragment')}
        successCallback={document => {
          flash({ id: 'users.edit_success', properties: { name: document.displayName }, type: 'success' })
          if (toggle) {
            toggle()
          } else if (terms.slug) {
            history.push(`/users/${terms.slug}`)
          } else {
            history.push('/admin')
          }
        }}
        showRemove={true}
        removeSuccessCallback={document => {
          console.group('removeSuccessCallback:')
          console.log('document:', document)
          console.log('toggle:', toggle)
          console.log('history:', history)
          console.groupEnd()
          if (toggle) {
            toggle()
          } else {
            history.push('/')
            flash({ id: 'users.delete_success', type: 'success' })
          }
        }}
        cancelCallback={document => {
          if (toggle) {
            toggle()
          } else {
            history.goBack()
          }
        }}
      />
    </div>
  ) : (
    <FormattedMessage id="app.noPermission" />
  )
}

UsersEditForm.propTypes = {
  terms: PropTypes.object // a user is defined by its unique _id or its unique slug. see UsersAccount.jsx
}

UsersEditForm.contextTypes = {
  intl: intlShape
}

registerComponent({
  name: 'UsersEditForm',
  component: UsersEditForm,
  hocs: [
    withCurrentUser,
    withMessages,
    withRouter
    // mapProps(mapPropsFunction), [withSingle, options] // mapProps must precede withSingle
  ]
})
