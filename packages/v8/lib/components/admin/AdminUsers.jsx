import { Components, registerComponent, withAccess } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React from 'react'
import { Link } from 'react-router-dom'

const AdminUsers = () => (
  <div className="admin-users">
    <Components.HeadTags title='V8: Users Admin' />
    <Components.Datatable
      collection={Users}
      columns={[
        {
          name: 'createdAt',
          sortable: true,
        },
        {
          name: 'displayName',
          sortable: true,
        },
        {
          name: 'slug',
          sortable: true,
          component: ({ document }) => <Link to={`/users/${document.slug}`} title={document.displayName}>{document.slug}</Link> // eslint-disable-line react/display-name
        },
        {
          name: 'email',
          sortable: true,
        },
        {
          name: 'groups',
          filterable: true,
        }
      ]}
    />
  </div>
)

const accessOptions = {
  groups: ['admins'],
  redirect: '/',
  message: 'Sorry, you do not have the rights to access this page.'
}

registerComponent('AdminUsers', AdminUsers, [withAccess, accessOptions])

export default AdminUsers
