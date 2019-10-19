import { registerFragment } from 'meteor/vulcan:core';

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
`);
