import { Components, registerComponent } from 'meteor/vulcan:lib'
import React from 'react'

const NewRegistration = () => {
  const body = `Thank you for registering with V8.

Once your account has been approved, you will have access to all Contacts, Offices, Projects, Past Projects and Search. Until your account is approved, you can see our Dashboard graphs, which show some casting trends, and you can begin to explore items that have changed recently in Latest Updates.

_Welcome!_`

  return (
    <Components.Message
      header={'Welcome to V8'}
      body={body}
    />
  )
}

registerComponent({
  name: 'NewRegistration',
  component: NewRegistration
})
