import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import Breadcrumbs from 'react-breadcrumbs'; // NB: 1.6.x required for react-router v3

class Breadcrumb extends PureComponent {
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
        <Components.HeadTags title={`V8 Alba: ${this.props.routes[1].name}`} />
      </div>
    );
  }
}

registerComponent('Breadcrumb', Breadcrumb, withRouter);
