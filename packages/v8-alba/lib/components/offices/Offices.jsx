import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'

const Offices = ({ children, history }) => (
  <div>
    { children || history.push('/offices/list') }
  </div>
)

registerComponent('Offices', Offices, withRouter)
