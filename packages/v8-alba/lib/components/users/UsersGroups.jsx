  import { registerComponent, withCurrentUser } from 'meteor/vulcan:core'
  import Users from 'meteor/vulcan:users'
  import React from 'react'

  function UsersGroups ({ currentUser }) {
    const getGroups = (currentUser && Users.getGroups && Users.getGroups(currentUser)) || ['admins']
    // const groups = (currentUser && currentUser.groups) || []
    // const isParticipant = Users.isMemberOf(currentUser, ['participants'])
    return (
      <div className='flash-messages info'>
        {currentUser &&
          <pre>
            {/* <code>{currentUser.displayName} </code> */}
            <code>{JSON.stringify({ getGroups }, null, 2)}</code>
            {/* <code>{JSON.stringify({ groups }, null, 2)}</code> */}
            {/* <code>{JSON.stringify({ isParticipant }, null, 2)}</code> */}
          </pre>
        }
      </div>
    )
  }

  registerComponent({
    name: 'UsersGroups',
    component: UsersGroups,
    hocs: [withCurrentUser]
  })
