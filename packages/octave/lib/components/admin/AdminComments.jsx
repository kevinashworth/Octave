import { Components, withAccess } from 'meteor/vulcan:core'
import { getString } from 'meteor/vulcan:lib'
import React from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import moment from 'moment'
import { DATE_FORMAT_MONGO } from '../../modules/constants.js'
import { Comments } from '../../modules/comments/collection.js'

const bodyDisplay = ({ document }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: document.htmlBody }} />
  )
}

const docDisplay = ({ document }) => {
  let { collectionName } = document
  if (collectionName === 'PastProjects') {
    collectionName = 'past-projects'
  } else {
    collectionName = collectionName.toLowerCase()
  }
  return (
    <small>
      <Link to={`/${collectionName}/${document.objectId}`}>
        {document.objectId}
      </Link>
    </small>
  )
}

const dateDisplay = ({ document }) => {
  const TooltipDate = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
      <a href='#' style={{ color: '#23282c', textDecoration: 'none', whiteSpace: 'nowrap' }}>{children}</a>
    </OverlayTrigger>
  )
  return (
    <TooltipDate
      title={moment(document.postedAt).format(DATE_FORMAT_MONGO)}
      id={document._id}
    >
      <small>
        {moment(document.postedAt).fromNow()}
      </small>
    </TooltipDate>
  )
}

const userDisplay = ({ document }) => {
  const TooltipUser = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
      {children}
    </OverlayTrigger>
  )
  return (
    <TooltipUser
      title={document.user.displayName}
      id={document._id}
    >
      <small>
        <Link to={`/users/${document.user.slug}`}>
          {document.userId}
        </Link>
      </small>
    </TooltipUser>
  )
}

const AdminComments = () => {
  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title='Comments Admin' />
      <Card>
        <Card.Body>
          <Card.Title>Comments Admin</Card.Title>
          <Components.Datatable
            collection={Comments}
            columns={[
              {
                name: 'postedAt',
                label: 'Date ',
                sortable: true,
                component: dateDisplay
              },
              {
                name: 'userId',
                label: 'User ID',
                component: userDisplay
              },
              {
                name: 'collectionName',
                label: 'Coll. ',
                sortable: true,
                component: ({ document }) => <small>{document.collectionName}</small>
              },
              {
                name: 'objectId',
                label: 'Doc ID',
                component: docDisplay
              },
              {
                name: 'body',
                component: bodyDisplay
              }
            ]}
            editFormProps={{
              size: 'sm'
            }}
            initialState={{
              sort: {
                postedAt: 'desc'
              }
            }}
            options={{
              fragmentName: 'CommentItemAdmin'
            }}
            showNew={false}
            showSearch
          />
        </Card.Body>
      </Card>
    </div>
  )
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

AdminComments.displayName = 'WithAccess(AdminComments)'

export default withAccess(accessOptions)(AdminComments)
