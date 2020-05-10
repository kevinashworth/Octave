import { getCollection } from 'meteor/vulcan:lib'
import Users from 'meteor/vulcan:users'
import SimpleSchema from 'simpl-schema'

const notificationsGroup = {
  name: 'notifications',
  order: 2
}

const adminGroup = {
  name: 'admin',
  order: 100
}

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
  },
  {
    fieldName: 'emails',
    fieldSchema: {
      canRead: ['owners', 'admins']
    }
  },
  {
    fieldName: 'emails.$',
    fieldSchema: {}
  },
  {
    fieldName: 'groups',
    fieldSchema: {
      canRead: ['admins'],
      defaultValue: ['pending'],
      form: {
        options: function () {
          const groups = _.without(
            _.keys(getCollection('Users').groups),
            'guests',
            'members',
            'owners',
            'admins'
          )
          return groups.map(group => {
            return { value: group, label: group }
          })
        },
      }
    }
  },
  {
    fieldName: 'groups.$',
    fieldSchema: {}
  }
])

// fields we are ADDING
Users.addField([
  // Users must be approved, else is in group 'pending' only
  // {
  //   fieldName: 'isApproved',
  //   fieldSchema: {
  //     label: 'Approved',
  //     type: Boolean,
  //     optional: false,
  //     defaultValue: false,
  //     input: 'checkbox',
  //     itemProperties: { layout: 'inputOnly' },
  //     group: adminGroup,
  //     canRead: ['admins'],
  //     canCreate: ['admins'],
  //     canUpdate: ['admins']
  //   }
  // },
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
      // `usersEditGenerateHtmlBio` in vulcan:users currently does the following
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
