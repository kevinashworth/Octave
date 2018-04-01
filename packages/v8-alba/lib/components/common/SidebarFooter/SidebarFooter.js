import { registerComponent } from 'meteor/vulcan:core';
import React, {Component} from 'react';

class SidebarFooter extends Component {

  render() {
    return null
    // Uncomment following code lines to add Sidebar Footer
    // return (
    //   <div className="sidebar-footer"></div>
    // )
  }
}

registerComponent('SidebarFooter', SidebarFooter);
