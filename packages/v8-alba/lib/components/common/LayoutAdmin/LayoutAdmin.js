import { registerComponent } from 'meteor/vulcan:core'
import React from 'react'

const LayoutAdmin = ({ children }) => (
  <div className='app'>
    {children}
  </div>
)

registerComponent('LayoutAdmin', LayoutAdmin)
