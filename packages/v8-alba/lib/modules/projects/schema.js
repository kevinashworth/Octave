import { Utils } from 'meteor/vulcan:core'
import SimpleSchema from 'simpl-schema'
import marked from 'marked'
import { addressSubSchema, linkSubSchema } from '../shared_schemas.js'
import { PROJECT_TYPES_ENUM, PROJECT_STATUSES_ENUM } from '../constants.js'
import { getFullAddress, getPlatformType, getSortTitle } from '../helpers.js'

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
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    options: props => props.data.contacts.results.map(contact => ({
      value: contact._id,
      label: contact.fullName
    }))
  },
  contactName: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  contactTitle: {
    type: String,
    optional: true,
    hidden: true,
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
    canRead: ['guests']
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: ['guests'],
    onCreate: (o) => {
      if (!o.createdAt) { // keep createdAt from a past-project being made a project
        return new Date()
      }
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
    canRead: ['guests'],
    onCreate: () => {
      return new Date()
    },
    onUpdate: () => {
      return new Date()
    }
  },
  projectTitle: {
    label: 'Title',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    onCreate: ({ document }) => {
      return document.projectTitle.trim()
    },
    onUpdate: ({ data }) => {
      return data.projectTitle.trim()
    }
  },
  sortTitle: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['guests'],
    onCreate: ({ document }) => {
      return getSortTitle(document.projectTitle)
    },
    onUpdate: ({ data }) => {
      return getSortTitle(data.projectTitle)
    }
  },
  projectType: {
    label: 'Type',
    type: String,
    optional: false,
    input: 'select',
    options: () => {
      return PROJECT_TYPES_ENUM
    },
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  platformType: {
    label: 'Platform Type',
    type: String,
    optional: true,
    hidden: true,
    canRead: ['guests'],
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
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  network: {
    label: 'Network',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  status: {
    label: 'Status',
    type: String,
    optional: false,
    input: 'select',
    options: () => {
      return PROJECT_STATUSES_ENUM
    },
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  renewed: {
    label: 'On Hiatus but Renewed',
    hidden: ({ document }) => { return document.status !== 'On Hiatus' },
    type: Boolean,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  // Summary (Markdown)
  summary: {
    label: 'Summary',
    type: String,
    optional: true,
    control: 'textarea', // use a textarea form component
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    inputProperties: {
      rows: 3
    },
  },
  // HTML version of Summary
  htmlSummary: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    onCreate: ({ document: project}) => {
      if (project.summary) {
        return Utils.sanitize(marked('**SUMMARY:** ' + project.summary))
      }
    },
    onUpdate: ({ data }) => {
      if (data.summary && data.summary.length) {
        return Utils.sanitize(marked('**SUMMARY:** ' + data.summary))
      } else {
        return null
      }
    }
  },
  website: {
    label: 'Official Site',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  // Notes (Markdown)
  notes: {
    label: 'Notes',
    type: String,
    optional: true,
    control: 'textarea', // use a textarea form component
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    inputProperties: {
      rows: 4
    },
  },
  // HTML version of Notes
  htmlNotes: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    onCreate: ({ document }) => {
      if (document.notes) {
        return Utils.sanitize(marked('**NOTES:** ' + document.notes))
      }
    },
    onUpdate: ({ data }) => {
      if (data.notes && data.notes.length) {
        return Utils.sanitize(marked('**NOTES:** ' + data.notes))
      } else {
        return null
      }
    }
  },
  season: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  order: {
    label: 'Order',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
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
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  castingOfficeId: {
    type: String,
    input: 'MySelect',
    inputProperties: {
      selectOne: true
    },
    label: 'Office',
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
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
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    onCreate: ({ document: project }) => {
      return Utils.slugify(project.projectTitle)
    },
    onUpdate: ({ data }) => {
      if (data.slug) {
        return Utils.slugify(data.slug)
      }
      if (data.projectTitle) {
        return Utils.slugify(data.projectTitle)
      }
    }
  },
  links: {
    label: 'Links',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    group: linkGroup
  },
  'links.$': {
    type: linkSubSchema
  },
  contacts: {
    label: 'Contacts',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
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
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
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
