import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import * as ReactBreadcrumbs from 'react-breadcrumbs'

class Breadcrumbs extends PureComponent {
  render () {
    return (
      <div>
        <ReactBreadcrumbs />
        <Components.HeadTags title={`V8 Alba: ${this.props.routes[1].name}`} />
      </div>
    )
  }
}

registerComponent('Breadcrumbs', Breadcrumbs, withRouter)
