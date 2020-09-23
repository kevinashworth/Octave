import { Components, registerComponent, withAccess } from 'meteor/vulcan:core'
import { getString } from 'meteor/vulcan:lib'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { DATE_FORMAT_MONGO } from '../../modules/constants.js'
import { Comments } from '../../modules/comments/collection.js'

const docLink = ({ document }) => {
  let { collectionName } = document
  const { objectId } = document
  if (collectionName === 'PastProjects') {
    collectionName = 'past-projects'
  } else {
    collectionName = collectionName.toLowerCase()
  }
  return <Link to={`/${collectionName}/${objectId}`}>{objectId}</Link>
}

class AdminComments extends Component {
  render () {
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8: Comments Admin' />
        <Components.Datatable
          collection={Comments}
          options={{
            fragmentName: 'CommentItemAdmin',
            limit: 100
          }}
          initialState={{
            sort: {
              postedAt: 'desc'
            }
          }}
          showNew={false}
          showSearch
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
              component: ({ document }) => <Link to={`/users/${document.user.slug}`} title={document.user.displayName}>{document.userId}</Link>
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
              component: docLink
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

const message = getString({
  id: 'users.cannot_access',
  values: {
    title: 'Comments Admin'
  }
})

const accessOptions = {
  groups: ['admins'],
  redirect: '/',
  message
}

registerComponent({
  name: 'AdminComments',
  component: AdminComments,
  hocs: [[withAccess, accessOptions]]
})

export default AdminComments
