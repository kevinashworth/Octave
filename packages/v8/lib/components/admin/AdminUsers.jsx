/* eslint-disable react/display-name */
import { Components, registerComponent, withAccess } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React from 'react'
import { Link } from 'react-router-dom'

const AdminUsers = () => (
  <div className='admin-users'>
    <Components.HeadTags title='V8: Users Admin' />
    <Components.Datatable
      collection={Users}
      columns={[
        {
          label: 'Avatar',
          component: ({ document: user }) => <Components.Avatar user={user} size='xsmall' gutter='right' />
        },
        {
          name: 'displayName',
          sortable: true
        },
        {
          name: 'slug',
          sortable: true,
          component: ({ document }) => <Link to={`/users/${document.slug}`} title={document.displayName}>{document.slug}</Link>
        },
        {
          name: 'email',
          sortable: true
        },
        {
          name: 'groups',
          filterable: true
        },
        {
          name: 'createdAt',
          sortable: true
        },
        {
          name: 'updatedAt',
          sortable: true
        }
      ]}
      options={{
        fragmentName: 'UsersProfile'
      }}
    />
  </div>
)

const accessOptions = {
  groups: ['admins'],
  redirect: '/',
  message: 'Sorry, you do not have the rights to access this page.'
}

registerComponent({
  name: 'AdminUsers',
  component: AdminUsers,
  hocs: [
    [withAccess, accessOptions]
  ]
})

export default AdminUsers
