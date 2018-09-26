import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'

class SidebarHeader extends PureComponent {
  render () {
    return null
    // Uncomment following code lines to add Sidebar Header
    // return (
    //   <div className="sidebar-header"></div>
    // )
  }
}

registerComponent('SidebarHeader', SidebarHeader)
