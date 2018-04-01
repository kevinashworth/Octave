import { registerComponent } from 'meteor/vulcan:core';
import React, {Component} from 'react';

class SidebarHeader extends Component {

  render() {
    return null
    // Uncomment following code lines to add Sidebar Header
    // return (
    //   <div className="sidebar-header"></div>
    // )
  }
}

registerComponent('SidebarHeader', SidebarHeader);
