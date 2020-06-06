import { Components, registerComponent, withCurrentUser, withSingle2 } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Markup from 'interweave'
import _ from 'lodash'
import moment from 'moment'
import mapProps from 'recompose/mapProps'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'

const UsersProfile = (props) => {
  const { currentUser, document, loading } = props
  if (loading) {
    return <Components.Loading />
  }
  if (!document) {
    return <FormattedMessage id='app.404' />
  }
  const user = document
  let displayDate =
    'User added ' + moment(user.createdAt).format(DATE_FORMAT_SHORT)
  if (user.updatedAt) {
    displayDate += ' / ' + 'Last modified ' + moment(user.updatedAt).format(DATE_FORMAT_LONG)
  }
  return (
    <div className='animated fadeIn'>
      <Components.HeadTags
        url={Users.getProfileUrl(user, true)}
        title={`V8: ${Users.getDisplayName(user)}`}
      />
      <Card className='card-accent-success'>
        <Card.Header as='h2'>
          {Users.getDisplayName(user)}
          {Users.canUpdate({ collection: Users, user: currentUser, document }) &&
            <div className='float-right'>
              <LinkContainer to={`/users/${user.slug}/edit`}>
                <Button variant='secondary'>Edit</Button>
              </LinkContainer>
            </div>}
        </Card.Header>
        <Card.Body>
          <Card.Title><b>Email</b></Card.Title>
          <Components.EmailDetail user={user} />
          <Card.Title><b>Bio</b></Card.Title>
          {user.htmlBio
            ? <Markup content={user.htmlBio} />
            : <Card.Text>{user.bio}</Card.Text>}
          <Card.Title><b>Links</b></Card.Title>
          {user.website &&
            <Card.Text>
              <a href={user.website} target='profilelinks'>{user.website} </a>
            </Card.Text>}
        </Card.Body>
        {user.twitterUsername &&
          <Card.Body>
            <Card.Text>
              <Button className='btn-twitter btn-brand'>
                <i className='fa fa-twitter' />
                <span>
                  <a href={'https://twitter.com/' + user.twitterUsername} target='profilelinks'>
                    {user.twitterUsername}
                  </a>
                </span>
              </Button>
            </Card.Text>
          </Card.Body>}
        <Card.Footer>
          <small className='text-muted'>{displayDate}</small>
        </Card.Footer>
      </Card>
    </div>
  )
}

UsersProfile.displayName = 'UsersProfile'

const options = {
  collection: Users,
  fragmentName: 'UsersProfile'
}

// const mapPropsFunction = props => ({
//   ...props,
//   documentId: props.match && props.match.params._id,
//   slug: props.match && props.match.params.slug
// })

// make router slug param available as `slug` prop
const mapPropsFunction = props => ({
  ...props,
  input: {
    filter: {
      slug: {
        _eq: _.get(props, 'match.params.slug')
      }
    }
  }
})

registerComponent({
  name: 'UsersProfile',
  component: UsersProfile,
  hocs: [
    mapProps(mapPropsFunction),
    withCurrentUser,
    [withSingle2, options]
  ]
})
