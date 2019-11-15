import SimpleSchema from 'simpl-schema'

const dataSchema = new SimpleSchema({
  date: {
    type: String, // YYYY-MM-DD HH:mm:ss
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  quantity: {
    type: Number,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
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
    onInsert: () => {
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
    onInsert: () => {
      return new Date()
    },
    onEdit: () => {
      return new Date()
    }
  },
  episodics: {
    label: 'Episodics',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  'episodics.$': {
    type: dataSchema
  },
  pilots: {
    label: 'Pilots',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  'pilots.$': {
    type: dataSchema
  },
  features: {
    label: 'Features',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  'features.$': {
    type: dataSchema
  },
  others: {
    label: 'Others',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  'others.$': {
    type: dataSchema
  }
}

export default schema
