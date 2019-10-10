import { Utils } from 'meteor/vulcan:core'
import SimpleSchema from 'simpl-schema'
import marked from 'marked'
import { addressSubSchema, linkSubSchema } from '../shared_schemas.js'
import { PROJECT_TYPES_ENUM, PROJECT_STATUSES_ENUM } from '../constants.js'
import { getFullAddress, getPlatformType } from '../helpers.js'

const addressGroup = {
  name: 'addresses',
  label: 'Addresses',
  order: 10
}

const contactGroup = {
  name: 'contacts',
  label: 'Contacts',
  order: 20
}

const linkGroup = {
  name: 'links',
  label: 'Links',
  order: 30
}

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
    onInsert: (o) => {
      if (!o.createdAt) { // keep createdAt from a project being made a past-project
        return new Date()
      }
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
    optional: false,
    input: 'select',
    options: () => {
      return PROJECT_TYPES_ENUM
    },
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  platformType: {
    label: 'Platform Type',
    type: String,
    optional: true,
    hidden: true,
    canRead: 'guests',
    onCreate: ({ document, currentUser }) => {
      return getPlatformType(document)
    },
    onUpdate: ({ data, document, currentUser }) => {
      return getPlatformType(document)
    }
  },
  union: {
    label: 'Union',
    type: String,
    optional: true,
    defaultValue: 'SAG-AFTRA',
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
    optional: false,
    input: 'select',
    options: () => {
      return PROJECT_STATUSES_ENUM
    },
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  renewed: {
    label: 'On Hiatus but Renewed',
    type: Boolean,
    optional: true,
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  // Summary (Markdown)
  summary: {
    label: 'Summary',
    type: String,
    optional: true,
    control: 'textarea', // use a textarea form component
    canRead: 'guests',
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  // HTML version of Summary
  htmlSummary: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    onInsert: (project) => {
      if (project.summary) {
        return Utils.sanitize(marked('**SUMMARY:** ' + project.summary))
      }
    },
    onEdit: (modifier, project) => {
      if (modifier.$set.summary) {
        return Utils.sanitize(marked('**SUMMARY:** ' + modifier.$set.summary))
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
  casting: {
    label: 'Casting Calculated',
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: async (o, args, { Offices }) => {
        if (o.castingCompany && o.castingCompany.length) {
          return o.castingCompany
        }
        if (o.castingOfficeId) {
          const office = await Offices.loader.load(o.castingOfficeId)
          return office.displayName
        }
        return null
      }
    }
  },
  castingCompany: {
    label: 'Casting Company',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  castingOfficeId: {
    type: String,
    label: 'Casting Office',
    input: 'MySelect',
    inputProperties: {
      selectOne: true
    },
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins'],
    options: props => props.data.offices.results.map(office => ({
      value: office._id,
      label: office.displayName
    })),
    query: `
      offices{
        results{
          _id
          displayName
        }
      }
    `,
    resolveAs: {
      fieldName: 'castingOffice',
      type: 'Office',
      resolver: (o, args, { Offices }) =>
        o.castingOfficeId && Offices.loader.load(o.castingOfficeId),
      addOriginalField: true
    }
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
  },
  links: {
    label: 'Links',
    type: Array,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members'],
    group: linkGroup
  },
  'links.$': {
    type: linkSubSchema
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
    `,
    group: contactGroup
  },
  'contacts.$': {
    type: contactSchema
  },
  allContactNames: {
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      resolver: (project) => {
        if (project.contacts) {
          const reduced = project.contacts.reduce(function (acc, cur) {
            return { contactName: acc.contactName + ' ' + cur.contactName }
          }, { contactName: '' })
          return reduced.contactName
        }
        return null
      }
    }
  },
  addresses: {
    type: Array,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    group: addressGroup
  },
  'addresses.$': {
    type: addressSubSchema
  },
  allAddresses: {
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      resolver: (project) => {
        if (project.addresses) {
          return project.addresses.reduce(function (acc, cur) {
            return acc + ' ' + getFullAddress(cur)
          }, '')
        }
        return null
      }
    }
  }
}

export default schema
