import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import * as ReactBreadcrumbs from 'react-breadcrumbs'

class Breadcrumbs extends PureComponent {
  render () {
    return (
      <div className='KevinSaysHello'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'><a href='#/'>Home</a></li>
          <li className='breadcrumb-item'><a href='#/forms'>Forms</a></li>
          <li className='active breadcrumb-item'>Basic Forms</li>
        </ol>
      </div>
      // <div>
      //   <ReactBreadcrumbs />
      //   <Components.HeadTags title={`V8 Alba: ${this.props.routes[1].name}`} />
      // </div>
    )
  }
}

registerComponent('Breadcrumbs', Breadcrumbs, withRouter)
