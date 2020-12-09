import { createSchema } from 'meteor/vulcan:core'

const dataSchema = createSchema({
  date: {
    type: Date,
    input: 'datetime',
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  quantity: {
    type: Number,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
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
  episodics: {
    label: 'Episodics',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  'episodics.$': {
    type: dataSchema
  },
  pilots: {
    label: 'Pilots',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  'pilots.$': {
    type: dataSchema
  },
  features: {
    label: 'Features',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  'features.$': {
    type: dataSchema
  },
  others: {
    label: 'Others',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  'others.$': {
    type: dataSchema
  }
}

export default schema
