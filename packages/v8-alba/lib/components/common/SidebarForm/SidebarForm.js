import { registerComponent } from 'meteor/vulcan:core'
import { PureComponent } from 'react'

class SidebarForm extends PureComponent {
  render () {
    return null
    // Uncomment following code lines to add Sidebar Form
    // return (
    //   <div className="sidebar-form"></div>
    // )
  }
}

registerComponent('SidebarForm', SidebarForm)
