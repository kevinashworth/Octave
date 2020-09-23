import { withSingle, Components, registerComponent, withMessages } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'

const UsersProfileCheck = ({ currentUser, document, loading, flash, toggle }, context) => {
  // we're loading all fields marked as "mustComplete" using withDocument
  const userMustCompleteFields = document

  // if user is not logged in, or userMustCompleteFields is still loading, don't return anything
  if (!currentUser || loading) {
    return null
  } else {
    // return fields that are required by the schema but haven't been filled out yet
    const fieldsToComplete = Users.getRequiredFields().filter(fieldName => {
      return !userMustCompleteFields[fieldName]
    })

    const showModal = fieldsToComplete.length > 0

    if (showModal) {
      const footer = (
        <a className='complete-profile-logout' onClick={() => Meteor.logout(() => window.location.reload())}>
          <FormattedMessage id='app.or' /> <FormattedMessage id='users.log_out' />
        </a>
      )
      return (
        <Components.Modal
          size='small'
          show={showModal}
          showCloseButton={false}
          title={<FormattedMessage id='users.complete_profile' />}
          footer={footer}
        >
          <Components.SmartForm
            collection={Users}
            documentId={currentUser._id}
            fields={fieldsToComplete}
            showRemove={false}
            successCallback={user => {
              const newUser = { ...currentUser, ...user }
              if (Users.hasCompletedProfile(newUser)) {
                flash({ id: 'users.profile_completed', type: 'success' })
              }
              if (toggle) {
                toggle()
              }
            }}
          />
        </Components.Modal>
      )
    } else {
      return null
    }
  }
}

UsersProfileCheck.propTypes = {
  currentUser: PropTypes.object
}

UsersProfileCheck.displayName = 'UsersProfileCheck'

const options = {
  collection: Users,
  fragmentName: 'UsersProfile'
}

registerComponent({
  name: 'UsersProfileCheck',
  component: UsersProfileCheck,
  hocs: [withMessages, [withSingle, options]]
})
