import { registerFragment } from 'meteor/vulcan:core'

// ----------------------------- Comments ------------------------------ //

registerFragment(/* GraphQL */`
  fragment CommentsList on Comment {
    _id
    collectionName
    objectId
    parentCommentId
    topLevelCommentId
    body
    htmlBody
    postedAt
    userId
    user {
      ...UsersMinimumInfo
    }
  }
`)

registerFragment(/* GraphQL */`
  fragment CommentItem on Comment {
    ...CommentsList
  }
`)

registerFragment(/* GraphQL */`
  fragment CommentItemAdmin on Comment {
    ...CommentItem
    createdAt
  }
`)
