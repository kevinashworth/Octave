import { Components, withAccess } from 'meteor/vulcan:core'
import { getString } from 'meteor/vulcan:lib'
import Users from 'meteor/vulcan:users'
import React from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

const groupsDisplay = ({ document }) => {
  const groups = Users.getGroups(document)
  groups.shift() // remove 'guests'
  groups.shift() // remove 'members'
  return (
    <ol className='contents-array'>
      {groups.map((item, index) => (
        <li key={index}>
          {item}
        </li>
      ))}
    </ol>
  )
}

const AdminUsers = () => (
  <div className='animated fadeIn'>
    <Components.MyHeadTags title='Users Admin' />
    <Card>
      <Card.Body>
        <Card.Title>Users Admin</Card.Title>
        <Components.Datatable
          collection={Users}
          columns={[
            {
              label: 'Avatar',
              // eslint-disable-next-line react/display-name
              component: ({ document }) => <Components.Avatar user={document} size='xsmall' gutter='right' />
            },
            {
              name: 'displayName',
              sortable: true
            },
            {
              name: 'slug',
              sortable: true,
              // eslint-disable-next-line react/display-name
              component: ({ document }) => <Link to={`/users/${document.slug}`} title={document.displayName}>{document.slug}</Link>
            },
            {
              name: 'email',
              sortable: true
            },
            {
              name: 'groups',
              component: groupsDisplay
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
          editFormProps={{
            size: 'sm'
          }}
          options={{
            fragmentName: 'UsersProfile'
          }}
        />
      </Card.Body>
    </Card>
  </div>
)

const message = getString({
  id: 'users.cannot_access',
  values: {
    title: 'Users Admin'
  }
})

const accessOptions = {
  groups: ['admins'],
  redirect: '/',
  message
}

AdminUsers.displayName = 'WithAccess(AdminUsers)'

export default withAccess(accessOptions)(AdminUsers)
