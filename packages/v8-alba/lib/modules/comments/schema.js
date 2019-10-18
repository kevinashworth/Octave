import Users from 'meteor/vulcan:users';
import marked from 'marked';
import { Utils } from 'meteor/vulcan:core';
import Contacts from '../contacts/collection.js'
import Offices from '../offices/collection.js'
import Projects from '../projects/collection.js'

const schema = {
  // default properties

  _id: {
    type: String,
    canRead: ['guests'],
  },
  createdAt: {
    type: Date,
    canRead: ['guests'],
    onCreate: () => {
      return new Date();
    }
  },
  userId: {
    type: String,
    canRead: ['members'],
    canCreate: ['members'],
    hidden: true,
    resolveAs: {
      fieldName: 'user',
      type: 'User',
      resolver: async (comment, args, {currentUser, Users}) => {
        if (!comment.userId) return null;
        const user = await Users.loader.load(comment.userId);
        return Users.restrictViewableFields(currentUser, Users, user);
      },
      addOriginalField: true
    },
  },

  // custom properties

  //  _id of the parent comment, if there is one
  parentCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    canRead: ['guests'],
    canCreate: ['members'],
    optional: true,
    resolveAs: {
      fieldName: 'parentComment',
      type: 'Comment',
      resolver: async (comment, args, {currentUser, Users, Comments}) => {
        if (!comment.parentCommentId) return null;
        const parentComment = await Comments.loader.load(comment.parentCommentId);
        return Users.restrictViewableFields(currentUser, Comments, parentComment);
      },
      addOriginalField: true
    },
    hidden: true
  },
  // _id of the top-level parent comment, if there is one
  topLevelCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    canRead: ['guests'],
    canCreate: ['members'],
    optional: true,
    resolveAs: {
      fieldName: 'topLevelComment',
      type: 'Comment',
      resolver: async (comment, args, {currentUser, Users, Comments}) => {
        if (!comment.topLevelCommentId) return null;
        const topLevelComment = await Comments.loader.load(comment.topLevelCommentId);
        return Users.restrictViewableFields(currentUser, Comments, topLevelComment);
      },
      addOriginalField: true
    },
    hidden: true
  },
  // For now, comments are always created and posted at the same time
  postedAt: {
    type: Date,
    optional: true,
    canRead: ['guests'],
    onCreate: () => {
      return new Date()
    }
  },
  // Body (Markdown)
  body: {
    type: String,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
    input: "textarea"
  },
  // HTML version of Body
  htmlBody: {
    type: String,
    optional: true,
    canRead: ['guests'],
    onCreate: ({ document: comment }) => {
      if (comment.body) {
        return Utils.sanitize(marked(comment.body))
      }
    },
    onUpdate: ({ data }) => {
      if (data.body) {
        return Utils.sanitize(marked(data.body))
      }
    }
  },
  // The comment author's name
  author: {
    type: String,
    optional: true,
    canRead: ['guests'],
    onUpdate: ({ data }) => {
      // if userId is changing, change the author name too
      if (data.userId) {
        return Users.getDisplayNameById(data.userId)
      }
    }
  },
  // Comment belongs to a contact, office, or project
  collectionName: {
    type: String,
    canCreate: ['members'],
    onCreate: ({ document }) => {
      console.log('where is collectionName in document?', document)
    }
  },
  // That contact's, office's, or project's _id
  objectId: {
    type: String,
    canCreate: ['members'],
    onCreate: ({ document }) => {
      console.log('where is objectId in document?', document)
    }
  },
  // Deleted comments don't appear.
  isDeleted: {
    type: Boolean,
    optional: true,
    canRead: ['guests'],
  },
  userIP: {
    type: String,
    optional: true,
    canRead: ['admins'],
  },
  userAgent: {
    type: String,
    optional: true,
    canRead: ['admins'],
  },
  referrer: {
    type: String,
    optional: true,
    canRead: ['admins'],
  },

  // GraphQL only fields

  // pageUrl: {
  //   type: String,
  //   optional: true,
  //   canRead: ['guests'],
  //   resolveAs: {
  //     fieldName: 'pageUrl',
  //     type: 'String',
  //     resolver: (comment, args, context) => {
  //       return context.Comments.getPageUrl(comment, true);
  //     },
  //   }
  // }
};

export default schema;
