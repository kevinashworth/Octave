import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router'

const Contacts = ({ children, router }) => (
  <div>
    { children || router.push('/contacts/datatable') }
  </div>
)

registerComponent('Contacts', Contacts, withRouter)
