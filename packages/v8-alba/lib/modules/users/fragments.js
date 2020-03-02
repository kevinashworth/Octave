import { registerFragment } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'

// replace UsersDefaultFragment
registerFragment(/* GraphQL */`
  fragment UsersDefaultFragment on User {
    _id
    username
    emailAddress
    emailVerified
    createdAt
    isAdmin
    locale
    services
    displayName
    email
    emailHash
    slug
    groups
  }
`)

registerFragment(/* GraphQL */`
  fragment UsersMinimumInfo on User {
    _id
    createdAt
    updatedAt
    slug
    username
    displayName
    emailHash
    avatarUrl
    pageUrl
  }
`)

registerFragment(/* GraphQL */`
  fragment UsersProfile on User {
    ...UsersMinimumInfo
    isAdmin
    bio
    htmlBio
    website
    email
    emails
    emailAddress
    emailVerified
    twitterUsername
    commentCount
  }
`)

registerFragment(/* GraphQL */`
  fragment UsersEditFragment on User {
    _id
    email
    emailAddress
    displayName
    username
    twitterUsername
    bio
    website
    notifications_comments
    notifications_posts
    notifications_replies
    notifications_users
    isAdmin
  }
`)

registerFragment(/* GraphQL */`
  fragment UsersMustCompleteFragment on User {
    _id
    ${Users.getRequiredFields().join('\n')}
  }
`)
