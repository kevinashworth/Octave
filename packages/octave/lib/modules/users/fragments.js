import { registerFragment } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'

registerFragment(/* GraphQL */`
  fragment UsersProfile on User {
    _id
    displayName
    username
    email
    emails
    services
    emailHash
    groups
    createdAt
    updatedAt
    slug
    avatarUrl
    pageUrl
    isAdmin
    notifications_comments
    notifications_posts
    notifications_replies
    notifications_users
    bio
    htmlBio
    website
    twitterUsername
    commentCount
    slug
  }
`)

registerFragment(/* GraphQL */`
  fragment UsersEditFragment on User {
    _id
    displayName
    email
    username
    twitterUsername
    bio
    website
    notifications_comments
    notifications_posts
    notifications_replies
    notifications_users
    isAdmin
    groups
    slug
  }
`)

registerFragment(/* GraphQL */`
  fragment UsersMustCompleteFragment on User {
    _id
    ${Users.getRequiredFields().join('\n')}
  }
`)
