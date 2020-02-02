import { registerFragment } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'

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
    twitterUsername
    commentCount
  }
`)

registerFragment(`
  fragment UsersEditFragment on User {
    displayName
    email
    twitterUsername
    username
    bio
    website
    isAdmin
  }
`)

registerFragment(`
  fragment UsersMustCompleteFragment on User {
    _id
    ${Users.getRequiredFields().join('\n')}
  }
`)
