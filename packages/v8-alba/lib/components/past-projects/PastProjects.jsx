import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'

const PastProjects = ({ children, history }) => (
  <div>
    { children || history.push('/past-projects/datatable') }
  </div>
)

registerComponent('PastProjects', PastProjects, withRouter)
