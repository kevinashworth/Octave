import { registerComponent } from 'meteor/vulcan:core';
import React, {Component} from 'react';

class SidebarForm extends Component {

  render() {
    return null
    // Uncomment following code lines to add Sidebar Form
    // return (
    //   <div className="sidebar-form"></div>
    // )
  }
}

registerComponent('SidebarForm', SidebarForm);
