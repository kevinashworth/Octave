import { Components, Utils } from 'meteor/vulcan:core'
import React, { lazy, Suspense } from 'react'
import marked from 'marked'
import { addressSubSchema, contactSubSchema, linkSubSchema, officeSubSchema } from '../shared_schemas.js'
import { PROJECT_TYPES_ENUM, PROJECT_STATUSES_ENUM } from '../constants.js'
import { getFullAddress, getPlatformType, getSortTitle } from '../helpers.js'

const MySelect = lazy(() => import('../../components/common/Forms/MySelect'))
const MySelectLazy = (props) => {
  return (
    <Suspense fallback={<Components.Loading />}>
      <MySelect {...props} />
    </Suspense>
  )
}

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
    onCreate: ({ document, currentUser }) => {
      if (!document.createdAt) { // keep createdAt from a project being made a past-project
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
    onCreate: ({ document }) => {
      if (!document.updatedAt) { // this keeps updatedAt from mockaroo
        return new Date()
      }
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
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  sortTitle: {
    type: String,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
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
    input: MySelectLazy,
    options: PROJECT_TYPES_ENUM,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
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
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  network: {
    label: 'Network',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  status: {
    label: 'Status',
    type: String,
    optional: false,
    input: MySelectLazy,
    options: PROJECT_STATUSES_ENUM,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  renewed: {
    label: 'On Hiatus but Renewed',
    type: Boolean,
    optional: true,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  shootingLocation: {
    label: 'Shooting Location',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  // Summary (Markdown)
  summary: {
    type: String,
    optional: true,
    input: 'textarea',
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
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
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  // Notes (Markdown)
  notes: {
    type: String,
    optional: true,
    input: 'textarea',
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
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
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  order: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  casting: {
    label: 'Casting Calculated',
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: async (project, args, { Offices }) => {
        if (project.offices && project.offices.length) {
          const office = await Offices.loader.load(project.offices[0].officeId)
          return office.displayName
        } else if (project.castingCompany && project.castingCompany.length) {
          return project.castingCompany
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
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  offices: {
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['members', 'admins'],
    group: officeGroup,
    query: /* GraphQL */`
      query OfficesNameAndId {
        offices {
          results {
            _id
            displayName
          }
        }
      }
    `
  },
  'offices.$': {
    type: officeSubSchema
  },
  // castingOfficeId: {
  //   label: 'Casting Office',
  //   type: String,
  //   input: MySelectLazy,
  //   optional: true,
  //   canRead: ['members'],
  //   canCreate: ['members', 'admins'],
  //   canUpdate: ['members', 'admins'],
  //   options: props => props.data.offices.results.map(office => ({
  //     value: office._id,
  //     label: office.displayName
  //   })),
  //   query: `
  //     offices{
  //       results{
  //         _id
  //         displayName
  //       }
  //     }
  //   `,
  //   resolveAs: {
  //     fieldName: 'castingOffice',
  //     type: 'Office',
  //     resolver: (o, args, { Offices }) =>
  //       o.castingOfficeId && Offices.loader.load(o.castingOfficeId),
  //     addOriginalField: true
  //   }
  // },
  slug: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
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
  links: {
    label: 'Links',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
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
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
    group: contactGroup,
    query: /* GraphQL */`
      query ContactsNameAndId {
        contacts{
          results{
            _id
            displayName
          }
        }
      }
    `
  },
  'contacts.$': {
    type: contactSubSchema
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
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
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
