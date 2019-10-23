import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText } from 'reactstrap'
import Users from 'meteor/vulcan:users'
import { Link } from 'react-router-dom'
import mapProps from 'recompose/mapProps'

class UsersProfile extends PureComponent {
  render() {
    const { currentUser, document, loading } = this.props
    if (loading) {
      return (
        <div className='page'>
          <Components.Loading />
        </div>
      )
    } else if (!document) {
      console.log(`// missing user (_id/slug: ${props.documentId || props.slug})`);
      return (
        <div className='page'>
          <FormattedMessage id='app.404' />
        </div>
      )
    } else {
      const user = document
      return (
        <div className='animated fadeIn'>
          <Components.HeadTags
            url={Users.getProfileUrl(user, true)}
            title={`V8 Alba: ${Users.getDisplayName(user)}`}
          />
          <Card className='card-accent-muted'>
            <CardHeader tag='h2'>{Users.getDisplayName(user)}{ Users.options.mutations.edit.check(currentUser, user)
              ? <div className='float-right'>
                <Button tag={Link} to={`/users/${user.slug}/edit`}>Edit</Button>
              </div> : null}
            </CardHeader>
            <CardBody>
              {user.htmlBio
               ? <CardText dangerouslySetInnerHTML={{ __html: user.htmlBio }} />
               : <CardText>{ user.bio }</CardText>
              }
              {user.website ? (
                <CardText>
                <a href={user.website} target='_links'>{user.website} </a>
                </CardText>
              ) : null}
            </CardBody>
            {user.twitterUsername ? (
              <CardBody>
                <CardText>
                  <Button className='btn-twitter'>
                    <span><CardLink href={'https://twitter.com/' + user.twitterUsername}> {user.twitterUsername} </CardLink></span>
                  </Button>
                </CardText>
              </CardBody>
            ) : null}
            <CardFooter>
              {this.props.blahblahblah ? <Components.UsersCommentsList /> : null}
            </CardFooter>
          </Card>
        </div>
      )
    }

  }

}

UsersProfile.displayName = 'UsersProfile'

const options = {
  collection: Users,
  fragmentName: 'UsersProfile'
}

const mapPropsFunction = props => ({
  ...props,
  documentId: props.match && props.match.params._id,
  slug: props.match && props.match.params.slug
})

registerComponent({
  name: 'UsersProfile',
  component: UsersProfile,
  hocs: [
    withCurrentUser,
    mapProps(mapPropsFunction), [withSingle, options]
  ]
})
