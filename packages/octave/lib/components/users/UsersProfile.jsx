import { Components, registerComponent, useCurrentUser, useSingle2 } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import get from 'lodash/get'
import MyMarkdown from '../common/MyMarkdown'
import { displayDates } from '../../modules/helpers.js'

const UsersProfile = (props) => {
  const slug = get(props, 'match.params.slug')

  const { currentUser } = useCurrentUser()
  const { document: user, loading } = useSingle2({
    collection: Users,
    fragmentName: 'UsersProfile',
    input: {
      filter: {
        slug: {
          _eq: slug
        }
      }
    }
  })

  if (loading) {
    return <Components.Loading />
  }

  if (!document) {
    return <FormattedMessage id='app.404' />
  }

  const dates = displayDates('User', user)

  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags
        url={Users.getProfileUrl(user, true)}
        title={Users.getDisplayName(user)}
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
          {user.bio
            ? <MyMarkdown markdown={user.bio} />
            : null}
          <Card.Title><b>Links</b></Card.Title>
          {user.website &&
            <Card.Text>
              <a href={user.website} target='profilelinks'>{user.website} </a>
            </Card.Text>}
          {user.twitterUsername &&
            <Card.Text>
                <Button className='btn-twitter btn-brand'>
                  <i className='fab fa-twitter' />
                  <span>
                    <a href={'https://twitter.com/' + user.twitterUsername} target='profilelinks'>
                      {user.twitterUsername}
                    </a>
                  </span>
                </Button>
            </Card.Text>}
        </Card.Body>
        <Card.Footer>
          <small className='text-muted'>{dates}</small>
        </Card.Footer>
      </Card>
    </div>
  )
}
registerComponent({
  name: 'UsersProfile',
  component: UsersProfile
})
