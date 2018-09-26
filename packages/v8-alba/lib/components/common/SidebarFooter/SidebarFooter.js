import { registerComponent } from 'meteor/vulcan:core'
import { PureComponent } from 'react'

class SidebarFooter extends PureComponent {
  render () {
    return null
    // Uncomment following code lines to add Sidebar Footer
    // return (
    //   <div className="sidebar-footer"></div>
    // )
  }
}

registerComponent('SidebarFooter', SidebarFooter)
