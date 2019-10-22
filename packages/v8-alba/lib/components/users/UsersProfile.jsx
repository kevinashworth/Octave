import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Button } from 'reactstrap'
import Users from 'meteor/vulcan:users'
import { Link } from 'react-router-dom'
import mapProps from 'recompose/mapProps'

const UsersProfile = props => {
  if (props.loading) {
    return (
      <div className='page'>
        <Components.Loading />
      </div>
    )
  } else if (!props.document) {
    console.log(`// missing user (_id/slug: ${props.documentId || props.slug})`);
    return (
      <div className='page'>
        <FormattedMessage id='app.404' />
      </div>
    )
  } else {
    const user = props.document
    return (
      <div className='page'>
        <Components.HeadTags
          url={Users.getProfileUrl(user, true)}
          title={`V8 Alba: ${Users.getDisplayName(user)}`}
        />
        <h2 className='page-title'>{Users.getDisplayName(user)}</h2>
        {user.htmlBio ? (
          <div dangerouslySetInnerHTML={{ __html: user.htmlBio }} />
        ) : null}
        <ul>
          {user.twitterUsername ? (
            <li>
              <Button className='btn-twitter'>
                <Link to={'https://twitter.com/' + user.twitterUsername}> {user.twitterUsername} </Link>
              </Button>
            </li>
          ) : null}
          {user.website ? (
            <li>
              <a href={user.website}>{user.website}</a>
            </li>
          ) : null}
          <Components.ShowIf
            check={Users.options.mutations.edit.check}
            document={user}
          >
            <li>
              <Link to={Users.getEditUrl(user)}>
                <FormattedMessage id='users.edit_account' />
              </Link>
            </li>
          </Components.ShowIf>
        </ul>
        {props.blahblahblah ? <Components.UsersCommentsList /> : null}
      </div>
    )
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
