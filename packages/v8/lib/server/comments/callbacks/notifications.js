/*
Comment notification callbacks
*/

import Users from 'meteor/vulcan:users';
import { getCollection } from 'meteor/vulcan:lib';
import { createNotification } from '../../emails/notifications.js';
import { Comments } from '../../../modules/comments/index.js';

// add new comment notification callback on comment submit
export function notifications (document, properties) {
  const comment = document
  const theObject = getCollection(comment.collectionName).findOne(comment.objectId);
  const theAuthor = Users.findOne(theObject.userId);
  let userIdsNotified = [];

  // 1. Notify author of entry (if they have new comment notifications turned on)
  //    but do not notify if they're the ones posting the comment
  if (Users.getSetting(theAuthor, 'notifications_comments', false) && comment.userId !== theAuthor._id) {
    createNotification(theObject.userId, 'newComment', {input: {id: comment._id}});
    userIdsNotified.push(theObject.userId);
  }

  // 2. Notify author of comment being replied to
  //    but do not notify if they're also entry author or comment author
  if (!!comment.parentCommentId) {
    const parentComment = Comments.findOne(comment.parentCommentId);
    if (parentComment.userId !== theObject.userId && parentComment.userId !== comment.userId) {
      const parentCommentAuthor = Users.findOne(parentComment.userId);
      // do not notify parent comment author if they have reply notifications turned off
      if (Users.getSetting(parentCommentAuthor, 'notifications_replies', false)) {
        createNotification(parentComment.userId, 'newReply', {input: {id: parentComment._id}});
        userIdsNotified.push(parentComment.userId);
      }
    }
  }
}
