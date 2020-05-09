import { registerFragment } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'

// replace UsersDefaultFragment
registerFragment(/* GraphQL */`
  fragment UsersDefaultFragment on User {
    _id
    username
    createdAt
    isAdmin
    locale
    services
    displayName
    email
    emailHash
    emails
    slug
    groups
  }
`)

// replace UsersCurrent fragment
registerFragment(/* GraphQL */`
  fragment UsersCurrent on User {
    _id
    username
    createdAt
    isAdmin
    displayName
    email
    emailHash
    slug
    groups
    services
    avatarUrl
    pageUrl
    locale
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
    twitterUsername
    commentCount
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
    isApproved
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
