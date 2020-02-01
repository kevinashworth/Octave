/*

Comment notification callbacks

*/

import Users from 'meteor/vulcan:users';
// import { getCollection } from 'meteor/vulcan:lib';
import { createNotification } from '../../emails/notifications.js';
// import { Posts } from '../../../modules/posts/index.js';
import { Comments } from '../../../modules/comments/index.js';

// add new comment notification callback on comment submit
export function notifications (document, properties) {
  const comment = document

  console.groupCollapsed('Hello from notifications (as an `after` callback)!')
  console.log('comment:', comment)
  console.groupEnd()

  // note: dummy content has disableNotifications set to true
  if(Meteor.isServer && !comment.disableNotifications) {

    // const theObject = getCollection(comment.collectionName).findOne(comment.objectId);
    const postAuthor = Users.findOne(comment.userId);


    let userIdsNotified = [];

    // 1. Notify author of post (if they have new comment notifications turned on)
    //    but do not notify author of post if they're the ones posting the comment
    if (Users.getSetting(postAuthor, 'notifications_comments', false) && comment.userId !== postAuthor._id) {
      createNotification(comment.userId, 'newComment', {documentId: comment._id});
      userIdsNotified.push(comment.userId);
    }

    // 2. Notify author of comment being replied to
    if (!!comment.parentCommentId) {

      const parentComment = Comments.findOne(comment.parentCommentId);

      // do not notify author of parent comment if they're also post author or comment author
      // (someone could be replying to their own comment)
      if (parentComment.userId !== comment.userId && parentComment.userId !== comment.userId) {

        const parentCommentAuthor = Users.findOne(parentComment.userId);

        // do not notify parent comment author if they have reply notifications turned off
        if (Users.getSetting(parentCommentAuthor, 'notifications_replies', false)) {
          createNotification(parentComment.userId, 'newReply', {documentId: parentComment._id});
          userIdsNotified.push(parentComment.userId);
        }
      }

    }

  }
}
