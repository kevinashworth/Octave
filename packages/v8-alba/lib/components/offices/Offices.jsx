import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router'

const Offices = ({ children, router }) => (
  <div>
    { children || router.push('/offices/list') }
  </div>
)

registerComponent('Offices', Offices, withRouter)
