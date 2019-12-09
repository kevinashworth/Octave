// import { Utils } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import SimpleSchema from 'simpl-schema'
// import marked from 'marked'

Users.addField([
  // Count of user's comments
  {
    fieldName: 'commentCount',
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      canRead: ['guests']
    }
  },
  // User's bio
  {
    fieldName: 'bio',
    fieldSchema: {
      type: String,
      optional: true,
      input: 'textarea',
      canCreate: ['members'],
      canUpdate: ['members'],
      canRead: ['guests'],
      searchable: true
    }
  },
  // User's bio (Markdown version)
  {
    fieldName: 'htmlBio',
    fieldSchema: {
      type: String,
      optional: true,
      canRead: ['guests']
      // usersEditGenerateHtmlBio in vulcan:users currently does the following
      // onCreate: ({ document }) => {
      //   return Utils.sanitize(marked(document.bio))
      // },
      // onUpdate: ({ data }) => {
      //   return Utils.sanitize(marked(data.bio))
      // }
    }
  },
  {
    fieldName: 'website',
    fieldSchema: {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true,
      input: 'text',
      canCreate: ['members'],
      canUpdate: ['members'],
      canRead: ['guests']
    }
  },
  {
    fieldName: 'updatedAt',
    fieldSchema: {
      type: Date,
      optional: true,
      hidden: true,
      canCreate: ['members'],
      canUpdate: ['members'],
      canRead: ['guests'],
      onCreate: () => {
        return new Date()
      },
      onUpdate: () => {
        return new Date()
      }
    }
  }
])

// import { Posts } from '../posts/index.js'
// import Users from 'meteor/vulcan:users'
//
// // We have no Users module, so put code in this file under Comments
// Users.addField([
//   {
//     fieldName: 'commentCount',
//     fieldSchema: {
//       type: Number,
//       optional: true,
//       defaultValue: 0,
//       canRead: ['guests']
//     }
//   }
// ])
//
// Posts.addField([
//   /**
//     Count of the post's comments
//   */
//   {
//     fieldName: 'commentCount',
//     fieldSchema: {
//       type: Number,
//       optional: true,
//       defaultValue: 0,
//       canRead: ['guests']
//     }
//   },
//   /**
//     An array containing the `_id`s of commenters
//   */
//   {
//     fieldName: 'commenters',
//     fieldSchema: {
//       type: Array,
//       optional: true,
//       resolveAs: {
//         fieldName: 'commenters',
//         type: '[User]',
//         resolver: async (post, args, { currentUser, Users }) => {
//           if (!post.commenters) return []
//           const commenters = await Users.loader.loadMany(post.commenters)
//           return Users.restrictViewableFields(currentUser, Users, commenters)
//         }
//       },
//       canRead: ['guests']
//     }
//   },
//   {
//     fieldName: 'commenters.$',
//     fieldSchema: {
//       type: String,
//       optional: true
//     }
//   }
// ])

/*

Custom fields on Users collection

*/
