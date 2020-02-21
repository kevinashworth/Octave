import { Utils } from 'meteor/vulcan:core'
import marked from 'marked'
import { addressSubSchema, contactSubSchema, linkSubSchema, officeSubSchema } from '../shared_schemas.js'
import { PROJECT_TYPES_ENUM, PROJECT_STATUSES_ENUM, GROUPED_LOCATIONS_ENUM } from '../constants.js'
import { getFullAddress, getPlatformType, getSortTitle } from '../helpers.js'

const officeGroup = {
  name: 'offices',
  label: 'Offices',
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

const addressGroup = {
  name: 'addresses',
  label: 'Addresses',
  order: 40
}

let schema = {

  /* default properties */

  _id: {
    type: String,
    canRead: ['guests']
  },
  createdAt: {
    type: Date,
    canRead: ['guests'],
    onCreate: (project) => {
      if (!project.createdAt) { // this keeps createdAt from a past-project being made a project
        return new Date()
      }
    }
  },
  userId: {
    type: String,
    canRead: ['members']
  },

  /* custom properties */

  updatedAt: {
    type: Date,
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
    canRead: ['guests'],
    onCreate: ({ document }) => {
      return document.projectTitle.trim()
    },
    onUpdate: ({ data }) => {
      return data.projectTitle.trim()
    }
  },
  sortTitle: {
    type: String,
    hidden: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
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
    canRead: ['guests'],
    input: 'MySelect',
    options: () => {
      return PROJECT_TYPES_ENUM
    },
  },
  platformType: {
    type: String,
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
    defaultValue: 'SAG-AFTRA',
    canRead: ['guests'],
  },
  network: {
    type: String,
    canRead: ['guests'],
  },
  status: {
    type: String,
    optional: false,
    canRead: ['guests'],
    input: 'MySelect',
    options: () => {
      return PROJECT_STATUSES_ENUM
    },
  },
  renewed: {
    label: 'On Hiatus but Renewed',
    hidden: ({ document, formType }) => {
      return formType !== 'new' && document.status !== 'On Hiatus'
    },
    type: Boolean,
    canRead: ['guests'],
  },
  shootingLocation: {
    label: 'Shooting Location',
    type: String,
    canRead: ['guests'],
    input: 'MyDatalist',
    options: () => {
      return GROUPED_LOCATIONS_ENUM
    },
  },
  summary: {
    type: String,
    canRead: ['guests'],
    input: 'textarea',
    inputProperties: {
      rows: 3
    }
  },
  htmlSummary: {
    type: String,
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
  notes: {
    type: String,
    canRead: ['members'],
    input: 'textarea',
    inputProperties: {
      rows: 4
    }
  },
  htmlNotes: {
    type: String,
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
  website: {
    label: 'Official Site',
    type: String,
    canRead: ['guests'],
    inputProperties: {
      placeholder: 'https://'
    }
  },
  season: {
    type: String,
    canRead: ['members'],
  },
  order: {
    type: String,
    canRead: ['members'],
  },
  castingCompany: {
    label: 'Casting Company',
    type: String,
    canRead: ['members'],
  },
  casting: {
    label: 'Casting Calculated',
    type: String,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: async (project, args, { Offices }) => {
        if (project.offices && project.offices[0]) {
          const office = await Offices.loader.load(project.offices[0].officeId)
          return office.displayName
        } else if (project.castingCompany && project.castingCompany.length) {
          return project.castingCompany
        }
        return null
      }
    }
  },
  offices: {
    type: Array,
    canRead: ['members'],
    group: officeGroup,
    query: `
      offices {
        results {
          _id
          displayName
        }
      }
    `,
  },
  'offices.$': {
    type: officeSubSchema
  },
  contacts: {
    type: Array,
    canRead: ['members'],
    query: `
      contacts {
        results {
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
  links: {
    type: Array,
    canRead: ['members'],
    group: linkGroup
  },
  'links.$': {
    type: linkSubSchema
  },
  allContactNames: {
    type: String,
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
    canRead: ['members'],
    group: addressGroup
  },
  'addresses.$': {
    type: addressSubSchema
  },
  allAddresses: {
    type: String,
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
  },
  slug: {
    type: String,
    canRead: ['guests'],
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
  }
}

// let keys = Object.keys(schema)
// console.log('keys:', keys)
//
// const allFields = [
//   '_id',
//   'createdAt',
//   'userId',
//   'updatedAt',
//   'projectTitle',
//   'sortTitle',
//   'projectType',
//   'platformType',
//   'union',
//   'network',
//   'status',
//   'renewed',
//   'shootingLocation',
//   'summary',
//   'htmlSummary',
//   'website',
//   'notes',
//   'htmlNotes',
//   'season',
//   'order',
//   'slug',
//   'castingCompany',
//   'casting',
//   'contacts',
//   'contacts.$',
//   'offices',
//   'offices.$',
//   'links',
//   'links.$',
//   'allContactNames',
//   'addresses',
//   'addresses.$',
//   'allAddresses'
// ]

const optionalFields = [
  '_id',
  'createdAt',
  'userId',
  'updatedAt',
  'projectTitle',
  'sortTitle',
  // 'projectType',
  'platformType',
  'union',
  'network',
  // 'status',
  'renewed',
  'shootingLocation',
  'summary',
  'htmlSummary',
  'website',
  'notes',
  'htmlNotes',
  'season',
  'order',
  'slug',
  'castingCompany',
  'casting',
  'contacts',
  'offices',
  'links',
  'allContactNames',
  'addresses',
  'allAddresses'
]

optionalFields.forEach(field => {
  schema[field].optional = true
})

const permissionFields = [
  // '_id',
  // 'createdAt',
  // 'userId',
  // 'updatedAt',
  'projectTitle',
  // 'sortTitle',
  'projectType',
  // 'platformType',
  'union',
  'network',
  'status',
  'renewed',
  'shootingLocation',
  'summary',
  // 'htmlSummary',
  'website',
  'notes',
  // 'htmlNotes',
  'season',
  'order',
  'slug',
  'castingCompany',
  // 'casting',
  'contacts',
  'offices',
  'links',
  // 'allContactNames',
  'addresses',
  // 'allAddresses'
]

permissionFields.forEach(field => {
  schema[field].canCreate = ['admins']
  schema[field].canUpdate = ['members', 'admins']
})

export default schema
