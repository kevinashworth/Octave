import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'

const Projects = ({ children, history }) => (
  <div>
    { children || history.push('/projects/datatable') }
  </div>
)

registerComponent('Projects', Projects, withRouter)
