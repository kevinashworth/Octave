import { Components, registerComponent } from 'meteor/vulcan:lib'
import React from 'react'

const NewRegistration = () => {
  const body = `Thank you for registering with Octave.

Once your account has been approved, you will have access to all of Octave, including Contacts, Offices, Projects, Past Projects and Search.

Until your account is approved, you do have access to our Dashboard graphs, which show some casting trends. You can also begin to explore items that have changed recently under the Latest Updates link to the left.`

  return (
    <Components.Message
      header='Welcome to Octave'
      body={body}
    />
  )
}

registerComponent({
  name: 'NewRegistration',
  component: NewRegistration
})
