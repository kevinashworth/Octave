import { registerComponent } from 'meteor/vulcan:core';
import React, {Component} from 'react';
import { withRouter } from 'react-router';
import Breadcrumbs from 'react-breadcrumbs'; // NB: 1.6.x required for react-router v3

class Breadcrumb extends Component {
  render() {
    return (
      <div>
        <Breadcrumbs
          routes={this.props.routes}
          params={this.props.params}
          separator=" /&nbsp;"                                  // emulate
          wrapperElement="ol" itemElement="li"                  // Breadcrumb &
          wrapperClass="breadcrumb" itemclass="breadcrumb-item" // BreadcrumbItem
          displayMissingText="Home" // TODO
        />
      </div>
    );
  }
}

registerComponent('Breadcrumb', Breadcrumb, withRouter);
