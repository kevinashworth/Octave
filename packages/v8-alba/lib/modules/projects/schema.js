import { Utils } from 'meteor/vulcan:core'
import SimpleSchema from 'simpl-schema'
import marked from 'marked'
import { addressSchema } from '../shared_schemas.js'
import { CASTING_TITLES_ENUM, PROJECT_TYPES_ENUM, PROJECT_STATUSES_ENUM } from '../constants.js'

const contactSchema = new SimpleSchema({
  contactId: {
    type: String,
    control: 'SelectContactIdNameTitle',
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    options: props => props.data.contacts.results.map(contact => ({
      value: contact._id,
      label: contact.fullName
    }))
  },
  contactName: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  contactTitle: {
    type: String,
    optional: true,
    options: () => {
      return CASTING_TITLES_ENUM
    },
    hidden: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  }
})

const schema = {
  // default properties

  _id: {
    type: String,
    optional: true,
    canRead: 'guests'
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: 'guests',
    onInsert: () => {
      return new Date()
    }
  },
  userId: {
    type: String,
    optional: true,
    viewableBy: ['members']
  },

  // custom properties

  updatedAt: {
    type: Date,
    optional: true,
    canRead: 'guests',
    onInsert: () => {
      return new Date()
    },
    onEdit: () => {
      return new Date()
    }
  },
  projectTitle: {
    label: 'Title',
    type: String,
    optional: true,
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  projectType: {
    label: 'Type',
    type: String,
    optional: true,
    input: 'select',
    options: () => {
      return PROJECT_TYPES_ENUM
    },
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  union: {
    label: 'Union',
    type: String,
    optional: true,
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  network: {
    label: 'Network',
    type: String,
    optional: true,
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  status: {
    label: 'Status',
    type: String,
    optional: true,
    input: 'select',
    options: () => {
      return PROJECT_STATUSES_ENUM
    },
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  // Logline (Markdown)
  logline: {
    label: 'Logline',
    type: String,
    optional: true,
    control: 'textarea', // use a textarea form component
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  // HTML version of Logline
  htmlLogline: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    onInsert: (project) => {
      if (project.logline) {
        return Utils.sanitize(marked('**LOG LINE:** ' + project.logline))
      }
    },
    onEdit: (modifier, project) => {
      if (modifier.$set.logline) {
        return Utils.sanitize(marked('**LOG LINE:** ' + modifier.$set.logline))
      }
    }
  },
  website: {
    label: 'Official Site',
    type: String,
    optional: true,
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  // Notes (Markdown)
  notes: {
    label: 'Notes',
    type: String,
    optional: true,
    control: 'textarea', // use a textarea form component
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  // HTML version of Notes
  htmlNotes: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    onInsert: (project) => {
      if (project.notes) {
        return Utils.sanitize(marked('**NOTES:** ' + project.notes))
      }
    },
    onEdit: (modifier, project) => {
      if (modifier.$set.notes) {
        return Utils.sanitize(marked('**NOTES:** ' + modifier.$set.notes))
      }
    }

  },
  season: {
    label: 'Season',
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  order: {
    label: 'Order',
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  castingCompany: {
    label: 'Casting Company',
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  contacts: {
    label: 'Contacts',
    type: Array,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    query: `
      contacts{
        results{
          _id
          fullName
        }
      }
    `
  },
  'contacts.$': {
    type: contactSchema
  },
  addresses: {
    type: Array,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  'addresses.$': {
    type: addressSchema
  },
  slug: {
    type: String,
    optional: true,
    canRead: 'guests',
    canCreate: ['members'],
    canUpdate: ['members'],
    onInsert: (project) => {
      return Utils.slugify(project.projectTitle)
    },
    onEdit: (modifier, project) => {
      if (modifier.$set.slug) {
        return Utils.slugify(modifier.$set.slug)
      }
      if (modifier.$set.projectTitle) {
        return Utils.slugify(modifier.$set.projectTitle)
      }
    }
  }
}

export default schema
