const schema = {

  // default properties

  _id: {  // equal to contact's, office's, or project's _id
    type: String,
    optional: true,
    canRead: ['members']
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: ['members'],
    onCreate: () => {
      return new Date()
    }
  },
  userId: {
    type: String,
    optional: true,
    canRead: ['members']
  },

  // custom properties

  updatedAt: { // Dates and fast-json-patch don't work together, so use String not Date
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    onCreate: () => {
      return new Date().toUTCString()
    },
    onUpdate: () => {
      return new Date().toUTCString()
    }
  },
  // History of a contact, office, or project
  collectionName: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  // This is the meat of the matter
  patches: {
    type: Array,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    blackbox: true
  },
  'patches.$': {
    type: Object,
    optional: true
  },
  // Deleted objects don't appear.
  // isDeleted: {
  //   type: Boolean,
  //   optional: true,
  //   defaultValue: false,
  //   canRead: ['guests'],
  //   canCreate: ['members', 'admins'],
  //   canUpdate: ['members', 'admins'],
  // },
}

export default schema
