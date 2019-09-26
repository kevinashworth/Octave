import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'

const Contacts = ({ children, history }) => (
  <div>
    { children || history.push('/contacts/') }
  </div>
)

registerComponent('Contacts', Contacts, withRouter)
