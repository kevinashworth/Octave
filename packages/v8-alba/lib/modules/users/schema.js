import Users from 'meteor/vulcan:users'
import SimpleSchema from 'simpl-schema'

const notificationsGroup = {
  name: 'notifications',
  order: 2
}

// fields we are REPLACING
Users.addField([
  {
    fieldName: 'createdAt',
    fieldSchema: {
      type: Date,
      optional: true,
      canRead: ['guests'],
      onCreate: () => {
        return new Date();
      }
    }
  },
  {
    fieldName: 'locale',
    fieldSchema: {
      type: String,
      label: 'Preferred Language',
      optional: true,
      hidden: true,
      defaultValue: 'en',
      canRead: ['guests']
    }
  }
])

// fields we are ADDING
Users.addField([
  // email.address - REDUNDANT FOR NOW, MAY NOT KEEP
  {
    fieldName: 'emailAddress',
    fieldSchema: {
      type: String,
      canRead: ['admins'],
      resolveAs: {
        resolver: (user) => {
          if (user.email) {
            return user.email
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
      group: notificationsGroup
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
      group: notificationsGroup
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
      group: notificationsGroup
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
      group: notificationsGroup
    }
  }
])
