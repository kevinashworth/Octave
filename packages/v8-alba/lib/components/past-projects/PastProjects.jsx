import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router'

const PastProjects = ({ children, router }) => (
  <div>
    { children || router.push('/past-projects/datatable') }
  </div>
)

registerComponent('PastProjects', PastProjects, withRouter)
