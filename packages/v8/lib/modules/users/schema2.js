import SimpleSchema from 'simpl-schema'
const notificationsGroup = {
  name: 'notifications',
  order: 10
}

const schema2 = {
  bio: {
    type: String,
    optional: true,
    mustComplete: true,
    input: 'textarea',
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
    searchable: true
  },
  htmlBio: {
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
  },
  commentCount: {
    type: Number,
    optional: true,
    defaultValue: 0,
    canRead: ['guests']
  },
  website: {
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
  },
  updatedAt: {
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
  },
  // Add notifications options to user profile settings
  notifications_users: {
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
  },
  notifications_posts: {
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
  },
  notifications_comments: {
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
  },
  notifications_replies: {
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

export default schema2
