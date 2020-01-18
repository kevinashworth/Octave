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
          initialState={{
            sort: {
              postedAt: 'desc'
            }
          }}
          showNew={false}
          showSearch={true}
          editFormProps={{
            size: 'sm'
          }}
          columns={[
            {
              name: 'postedAt',
              sortable: true
            },
            {
              name: 'objectId',
              label: 'Document',
              sortable: true,
              component: ({ document }) => <Link to={`/${document.collectionName.toLowerCase()}/${document.objectId}`}>{document.objectId}</Link>
            },
            {
              name: 'collectionName',
              label: 'Collection',
              sortable: true
            },
            {
              name: 'userId',
              label: 'User',
              sortable: true,
              component: ({ document }) => <Link to={`/users/${document.user.username}`}>{document.userId}</Link>
            },
            {
              name: 'body',
              filterable: true
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
