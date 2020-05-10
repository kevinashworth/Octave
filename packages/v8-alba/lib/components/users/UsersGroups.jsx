import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import PropTypes from 'prop-types'
import MyCode from '../common/MyCode'

function UsersGroups ({ user }) {
  return (
    <MyCode code={JSON.stringify(user)} language='json' />
  )
}

UsersGroups.propTypes = {
  user: PropTypes.object.isRequired
}

UsersGroups.defaultProps = {
  user: {
    displayName: 'No User Passed to UsersGroups',
    groups: ['guests']
  }
}

registerComponent({
  name: 'UsersGroups',
  component: UsersGroups
})
