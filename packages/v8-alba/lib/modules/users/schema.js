import Users from 'meteor/vulcan:users'
import SimpleSchema from 'simpl-schema'

const notificationsGroup = {
  name: 'notifications',
  order: 2
}

// Can't use `emails`, so use `handles` because it is non-similar
const handleSubSchema = new SimpleSchema({
  address: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  primary: {
    type: Boolean,
    optional: true,
    defaultValue: true,
    input: 'checkbox',
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  verified: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    input: 'checkbox',
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  visibility: {
    type: String,
    optional: true,
    defaultValue: 'private',
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
    options: () => {
      return ['private', 'public']
    }
  },
})

// fields we are MODIFYING
Users.addField([
  {
    fieldName: 'createdAt',
    fieldSchema: {
      canRead: ['guests']
    }
  },
  {
    fieldName: 'locale',
    fieldSchema: {
      hidden: true
    }
  },
  {
    fieldName: 'isAdmin',
    fieldSchema: {
      itemProperties: { layout: 'inputOnly' }
    }
  }
])

// fields we are ADDING
Users.addField([
  {
    fieldName: 'handles',
    fieldSchema: {
      type: Array,
      optional: true,
      canRead: ['guests'],
      canCreate: ['members'],
      canUpdate: ['members'],
    }
  },
  {
    fieldName: 'handles.$',
    fieldSchema: {
      type: handleSubSchema
    }
  },
  // email.address - REDUNDANT FOR NOW, MAY NOT KEEP
  {
    fieldName: 'emailAddress',
    fieldSchema: {
      type: String,
      canRead: ['members'],
      canCreate: ['members'],
      canUpdate: ['admins'],
      resolveAs: {
        resolver: (user) => {
          if (user.handles && user.handles[0]) {
            return user.handles[0].address
          } else if (user.emails && user.emails[0]) {
            return user.emails[0].address
          }
          return null
        }
      }
    }
  },
  // email.verified
  {
    fieldName: 'emailVerified',
    fieldSchema: {
      type: Boolean,
      optional: true,
      defaultValue: false,
      canRead: ['members'],
      canCreate: ['members'],
      canUpdate: ['admins'],
      resolveAs: {
        resolver: (user) => {
          if (user.handles && user.handles[0]) {
            return user.handles[0].verified
          } else if (user.emails && user.emails[0]) {
            return user.emails[0].verified
          }
          return null
        }
      }
    }
  },
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
      mustComplete: true,
      input: 'textarea',
      canRead: ['guests'],
      canCreate: ['members'],
      canUpdate: ['members'],
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
      canRead: ['guests'],
      canCreate: ['members'],
      canUpdate: ['members'],
      inputProperties: {
        placeholder: 'http://'
      }
    }
  },
  {
    fieldName: 'updatedAt',
    fieldSchema: {
      type: Date,
      optional: true,
      hidden: true,
      canRead: ['guests'],
      canCreate: ['members'],
      canUpdate: ['members'],
      onCreate: () => {
        return new Date()
      },
      onUpdate: () => {
        return new Date()
      }
    }
  },
  // Add notifications options to user profile settings
  {
    fieldName: 'notifications_users',
    fieldSchema: {
      label: 'New users',
      type: Boolean,
      optional: true,
      defaultValue: true,
      input: 'checkbox',
      canRead: ['guests'],
      canCreate: ['admins'],
      canUpdate: ['admins'],
      group: notificationsGroup,
      itemProperties: { layout: 'inputOnly' }
    }
  },
  {
    fieldName: 'notifications_posts',
    fieldSchema: {
      label: 'New posts',
      type: Boolean,
      optional: true,
      defaultValue: true,
      input: 'checkbox',
      canRead: ['guests'],
      canCreate: ['members'],
      canUpdate: ['members'],
      group: notificationsGroup,
      itemProperties: { layout: 'inputOnly' }
    }
  },
  {
    fieldName: 'notifications_comments',
    fieldSchema: {
      label: 'Comments on my posts',
      type: Boolean,
      optional: true,
      defaultValue: true,
      input: 'checkbox',
      canRead: ['guests'],
      canCreate: ['members'],
      canUpdate: ['members'],
      group: notificationsGroup,
      itemProperties: { layout: 'inputOnly' }
    }
  },
  {
    fieldName: 'notifications_replies',
    fieldSchema: {
      label: 'Replies to my comments',
      type: Boolean,
      optional: true,
      defaultValue: true,
      input: 'checkbox',
      canRead: ['guests'],
      canCreate: ['members'],
      canUpdate: ['members'],
      group: notificationsGroup,
      itemProperties: { layout: 'inputOnly' }
    }
  }
])

Users.find({ emails: { $exists: true } }).forEach(user => {
  if (user.emails && user.emails[0]) {
    const [...handles] = user.emails
    const emailAddress = user.emails[0].address
    const emailVerified = user.emails[0].verified
    Users.update(user._id,
      {
        $set: {
          handles,
          emailAddress,
          emailVerified
        }
      })
  }
})

// `removeField` causes errors no matter which order.
// Different errors, but errors, unless Vulcan changed to remove both at once.
// So `emails` will be unused, but it will remain in the schema.
// Users.removeField('emails.$')
// Users.removeField('emails')
