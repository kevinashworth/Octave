import { getSetting, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import PropTypes from 'prop-types'
import MyCode from '../common/MyCode'

function UsersGroups ({ user }) {
  if (getSetting('myDebug')) {
    return user
      ? <MyCode code={JSON.stringify(user)} language='json' />
      : <div>There is no current user</div>
  } else {
    return null
  }
}

UsersGroups.propTypes = {
  user: PropTypes.object
}

registerComponent({
  name: 'UsersGroups',
  component: UsersGroups
})
