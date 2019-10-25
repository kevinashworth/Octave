import { Components, getFragment, registerComponent, withCurrentUser, withMessages } from 'meteor/vulcan:core'
import { STATES } from 'meteor/vulcan:accounts'
import Users from 'meteor/vulcan:users'
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import mapProps from 'recompose/mapProps'

const UsersEditForm = ({ flash, history, terms, toggle }, context) => {
  console.group('UsersEditForm:')
  console.log('flash:', flash)
  console.log('history:', history)
  console.log('terms:', terms)
  console.log('toggle:', toggle)
  console.groupEnd()

  return (
    <Components.ShowIf
      check={Users.options.mutations.edit.check}
      document={terms.documentId ? {_id: terms.documentId} : {slug: terms.slug}}
      failureComponent={<FormattedMessage id='app.noPermission' />}
    >
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
            if (toggle) {
              toggle()
            } else {
              flash({ id: 'users.edit_success', properties: { name: document.displayName }, type: 'success' })
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
            } else if (terms.slug) {
              history.push(`/users/${terms.slug}`)
            } else {
              history.push('/dashboard')
            }
          }}
        />
      </div>
    </Components.ShowIf>
  )
}

UsersEditForm.propTypes = {
  terms: PropTypes.object, // a user is defined by its unique _id or its unique slug
}

UsersEditForm.contextTypes = {
  intl: intlShape
}

UsersEditForm.displayName = 'UsersEditForm'

// const options = {
//   collection: Users,
//   fragmentName: 'UsersProfile'
// }
//
// const mapPropsFunction = props => ({
//   ...props,
//   documentId: props.match && props.match.params._id,
//   slug: props.match && props.match.params.slug
// })
//
registerComponent({
  name: 'UsersEditForm',
  component: UsersEditForm,
  hocs: [
    withCurrentUser,
    withMessages,
    withRouter
  ]
})
