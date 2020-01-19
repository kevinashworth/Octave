import { Components, registerComponent, withAccess } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { DATE_FORMAT_MONGO } from '../../modules/constants.js'
import { Comments } from '../../modules/comments/collection.js'

class AdminComments extends Component {
  render () {
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='Comments Admin' />
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
              label: 'Date',
              sortable: true,
              component: ({ document }) => <span style={{ fontFamily: 'monospace' }}>{moment(document.postedAt).format(DATE_FORMAT_MONGO)}</span>
            },
            {
              name: 'userId',
              label: 'User ID',
              sortable: true,
              component: ({ document }) => <Link to={`/users/${document.user.username}`} title={document.user.displayName}>{document.userId}</Link>
            },
            {
              name: 'collectionName',
              label: 'Coll.',
              sortable: true
            },
            {
              name: 'objectId',
              label: 'Doc ID',
              sortable: true,
              component: ({ document }) => <Link to={`/${document.collectionName.toLowerCase()}/${document.objectId}`}>{document.objectId}</Link>
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
  message: 'Sorry, you do not have the rights to access the Comments Admin page.'
}

registerComponent({
  name: 'AdminComments',
  component: AdminComments,
  hocs: [[withAccess, accessOptions]]
})

export default AdminComments
