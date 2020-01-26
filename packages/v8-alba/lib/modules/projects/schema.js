import { Utils } from 'meteor/vulcan:core'
import marked from 'marked'
import { addressSubSchema, contactSubSchema, linkSubSchema, officeSubSchema } from '../shared_schemas.js'
import { PROJECT_TYPES_ENUM, PROJECT_STATUSES_ENUM, GROUPED_LOCATIONS_ENUM } from '../constants.js'
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

const schema = {

  /* default properties */

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

  /* custom properties */

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
    input: 'MySelect',
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
    input: 'MySelect',
    options: () => {
      return PROJECT_STATUSES_ENUM
    },
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  renewed: {
    label: 'On Hiatus but Renewed',
    hidden: ({ document, formType }) => {
      return formType !== 'new' && document.status !== 'On Hiatus'
    },
    type: Boolean,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  shootingLocation: {
    label: 'Shooting Location',
    type: String,
    optional: true,
    input: 'MyDatalist',
    options: () => {
      return GROUPED_LOCATIONS_ENUM
    },
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  // Summary (Markdown)
  summary: {
    type: String,
    optional: true,
    input: 'textarea',
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    inputProperties: {
      rows: 3
    }
  },
  // HTML version of Summary
  htmlSummary: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    onCreate: ({ document: project }) => {
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
    type: String,
    optional: true,
    input: 'textarea',
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    inputProperties: {
      rows: 4
    }
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
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  castingCompany: {
    label: 'Casting Company',
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
    type: contactSubSchema
   },
  slug: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    onCreate: ({ document }) => {
      return Utils.slugify(document.projectTitle)
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
  castingOffices: {
    label: 'Casting Offices',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    group: linkGroup,
    query: `
      offices{
        results{
          _id
          displayName
        }
      }
    `,
  },
  'castingOffices.$': {
    type: officeSubSchema
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
  allContactNames: {
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      resolver: (project) => {
        if (project.contacts) {
          const contactNames = project.contacts.map(contact => contact.contactName)
          return contactNames.join(' ')
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
          const addressStrings = project.addresses.map(project => getFullAddress(project))
          return addressStrings.join(' ')
        }
        return null
      }
    }
  }
}

export default schema
