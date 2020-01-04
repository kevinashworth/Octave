const schema = {
  // default properties

  _id: {
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

  updatedAt: {
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
    canUpdate: ['members', 'admins'],
    onCreate: ({ document }) => {
      if (document.collectionName) {
        return document.collectionName
      } else {
        console.log('collectionName missing! Here is the document:', document)
      }
    }
  },
  // That contact's, office's, or project's _id
  objectId: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    onCreate: ({ document }) => {
      if (document.objectId) {
        return document.objectId
      } else {
        console.log('objectId missing! Here is the document:', document)
      }
    }
  },
  // This is the meat of the matter
  changes: {
    type: Array,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    blackbox: true
  },
  'changes.$': {
    type: Object,
    optional: true
  },
  // Deleted objects don't appear.
  isDeleted: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
  },
}

export default schema
