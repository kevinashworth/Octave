/*

Comment notification callbacks

*/

import Users from 'meteor/vulcan:users';
import { getCollection } from 'meteor/vulcan:lib';
import { createNotification } from '../../emails/notifications.js';
// import { Posts } from '../../../modules/posts/index.js';
import { Comments } from '../../../modules/comments/index.js';

// add new comment notification callback on comment submit
export function notifications (document, properties) {
  console.groupCollapsed('Hello from notifications (as an `after` callback)!')
  const comment = document

  // console.log('comment:', comment)

  // note: dummy content has disableNotifications set to true
  if(Meteor.isServer && !comment.disableNotifications) {

    const theObject = getCollection(comment.collectionName).findOne(comment.objectId);
    const theAuthor = Users.findOne(theObject.userId);
    // console.log('theObject:', theObject)
    // console.log('theAuthor:', theAuthor)

    const theBoolean1 = Users.getSetting(theAuthor, 'notifications_comments', false)
    console.log('theBoolean1:', theBoolean1)
    const theBoolean2 = comment.userId !== theAuthor._id
    console.log('theBoolean2:', theBoolean2)

    let userIdsNotified = [];

    // 1. Notify author of post (if they have new comment notifications turned on)
    //    but do not notify author of post if they're the ones posting the comment
    if (Users.getSetting(theAuthor, 'notifications_comments', false) && comment.userId !== theAuthor._id) {
      createNotification(theObject.userId, 'newComment', {input: {id: comment._id}});
      console.log('just called createNotification 1')
      userIdsNotified.push(theObject.userId);
    }

    // 2. Notify author of comment being replied to
    if (!!comment.parentCommentId) {

      const parentComment = Comments.findOne(comment.parentCommentId);

      // do not notify author of parent comment if they're also post author or comment author
      // (someone could be replying to their own comment)
      if (parentComment.userId !== theObject.userId && parentComment.userId !== comment.userId) {

        const parentCommentAuthor = Users.findOne(parentComment.userId);

        // do not notify parent comment author if they have reply notifications turned off
        if (Users.getSetting(parentCommentAuthor, 'notifications_replies', false)) {
          createNotification(parentComment.userId, 'newReply', {input: {id: parentComment._id}});
          console.log('just called createNotification 2')
          userIdsNotified.push(parentComment.userId);
        }
      }
    }
  }
  console.groupEnd()
}
