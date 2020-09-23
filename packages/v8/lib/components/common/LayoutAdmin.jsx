import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'

const LayoutAdmin = ({ children }) => (
  <Components.Layout>
    {children}
  </Components.Layout>
)

registerComponent('LayoutAdmin', LayoutAdmin)
