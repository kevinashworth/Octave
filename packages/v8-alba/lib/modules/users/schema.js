import Users from 'meteor/vulcan:users'
import SimpleSchema from 'simpl-schema'

Users.addField([
  // first, a field we are EDITING not ADDING despite `addField` function name
  {
    fieldName: 'createdAt',
    fieldSchema: {
      canRead: ['guests']
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
