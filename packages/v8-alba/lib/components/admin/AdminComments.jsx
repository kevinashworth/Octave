import { Components, registerComponent, withAccess } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Comments } from '../../modules/comments/collection.js'

class AdminComments extends Component {
  render () {
    return (
      <div className='admin-comments'>
        <Components.Datatable
          collection={Comments}
          options={{
            fragmentName: 'CommentItemAdmin'
          }}
          columns={[
            {
              name: 'createdAt',
            },
            // {
            //   name: 'postedAt',
            // },
            {
              name: 'objectId',
              label: 'Object',
              component: ({ document }) => <Link to={`/${document.collectionName.toLowerCase()}/${document.objectId}`}>{document.objectId}</Link>
            },
            {
              name: 'collectionName',
              label: 'Collection',
            },
            {
              name: 'userId',
              label: 'User',
            },
            {
              name: 'body',
            }
          ]}
        />
      </div>
    )
  }
}

const accessOptions = {
  groups: ['admins'],
  redirect: '/',
  message: 'Sorry, you do not have the rights to access this page.'
}

registerComponent({
  name: 'AdminComments',
  component: AdminComments,
  hocs: [[withAccess, accessOptions]]
})

export default AdminComments
