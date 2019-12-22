import SimpleSchema from 'simpl-schema'

const algoliaSchema = new SimpleSchema({
  dateOfSend: {
    type: String, // YYYY-MM-DD HH:mm:ss
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  sentObjectCount: {
    type: Number,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  }
})

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
    type: Date,
    optional: true,
    canRead: ['members'],
    onCreate: () => {
      return new Date()
    },
    onUpdate: () => {
      return new Date()
    }
  },
  algolia: {
    label: 'Algolia',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  'algolia.$': {
    type: algoliaSchema
  },
}

export default schema

// const algoliaObjectSchema = new SimpleSchema({
//   objectID: {
//     type: String,
//     optional: true,
//     canRead: ['members']
//   },
//   name: {
//     type: String,
//     optional: true,
//     canRead: ['members']
//   },
//   url: {
//     type: String,
//     optional: true,
//     canRead: ['members']
//   },
//   addressString: {
//     type: String,
//     optional: true,
//     canRead: ['members']
//   },
//   allLinks: {
//     type: String,
//     optional: true,
//     canRead: ['members']
//   },
//   body: {
//     type: String,
//     optional: true,
//     canRead: ['members']
//   },
//   fullAddress: {
//     type: String,
//     optional: true,
//     canRead: ['members']
//   },
//   network: {
//     type: String,
//     optional: true,
//     canRead: ['members']
//   },
//   summary: {
//     type: String,
//     optional: true,
//     canRead: ['members']
//   },
//   notes: {
//     type: String,
//     optional: true,
//     canRead: ['members']
//   }
// })
