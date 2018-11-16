import { Utils } from 'meteor/vulcan:core'
import SimpleSchema from 'simpl-schema'
import marked from 'marked'
import { addressSubSchema } from '../shared_schemas.js'
import { getFullAddress } from '../helpers.js'
import _ from 'lodash'

function getContactsAsOptions (contacts) {
  return contacts.map(contact => ({
    value: contact._id,
    label: contact.fullName
  }))
}

const contactGroup = {
  name: 'contacts',
  label: 'Contacts',
  order: 10
}

const projectGroup = {
  name: 'projects',
  label: 'Projects',
  order: 20
}

const addressGroup = {
  name: 'addresses',
  label: 'Addresses',
  order: 30
}

const linkGroup = {
  name: 'links',
  label: 'Links',
  order: 40
}

const linkSchema = new SimpleSchema({
  platformName: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  profileName: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  profileLink: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  }
})

// const contactSubSchema = new SimpleSchema({
//   contactId: {
//     type: String,
//     optional: true,
//     canRead: ['members'],
//     canCreate: ['admins'],
//     canUpdate: ['admins']
//   },
//   contactName: {
//     type: String,
//     optional: true,
//     canRead: ['members'],
//     canCreate: ['admins'],
//     canUpdate: ['admins']
//   }
// })

const projectSubSchema = new SimpleSchema({
  projectId: {
    type: String,
    control: 'SelectProjectIdName',
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
    options: props => props.data.projects.results.map(project => ({
      value: project._id,
      label: project.projectTitle
    }))
  },
  projectTitle: {
    type: String,
    optional: true,
    hidden: true, // because taken care of in SelectProjectIdName.jsx
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
    viewableBy: ['guests']
  },
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ['members'],
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

  displayName: {
    label: 'Display Name',
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['admins'],
    editableBy: ['admins']
  },
  // Body (Markdown)
  body: {
    label: 'Notes',
    type: String,
    optional: true,
    control: 'textarea', // use a textarea form component
    viewableBy: ['members', 'admins'],
    insertableBy: ['members'],
    editableBy: ['members']
  },
  // HTML version of Body
  htmlBody: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members'],
    onInsert: (project) => {
      if (project.body) {
        return Utils.sanitize(marked(project.body))
      }
    },
    onEdit: (modifier, project) => {
      if (modifier.$set.body) {
        return Utils.sanitize(marked(modifier.$set.body))
      }
    }
  },
  links: {
    label: 'Links',
    type: Array,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    group: linkGroup
  },
  'links.$': {
    type: linkSchema
  },
  addresses: {
    type: Array,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members'],
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
      resolver: (o) => {
        if (o.addresses) {
          return o.addresses.reduce(function (acc, cur) {
            return acc + ' ' + getFullAddress(cur)
          }, '')
        }
        return null
      }
    }
  },
  slug: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    onInsert: (contact) => {
      return Utils.slugify(contact.displayName)
    },
    onEdit: (modifier, contact) => {
      if (modifier.$set.displayName) {
        return Utils.slugify(modifier.$set.displayName)
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
    viewableBy: ['guests'],
    onEdit: () => {
      return new Date()
    }
  },

  // An office has many projects
  projects: {
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
    query: `
      projects{
        results{
          _id
          projectTitle
        }
      }
    `,
    group: projectGroup
  },
  'projects.$': {
    type: projectSubSchema
  },

  // An office has many contacts

  contactIds: {
    type: Array,
    optional: true,
    control: 'MySelectMultiple',
    viewableBy: ['members'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    options: props => {
      return getContactsAsOptions(props.data.ContactsList)
    },
    query: `
      ContactsList{
        _id
        fullName
      }
    `,
    resolveAs: {
      fieldName: 'contacts',
      type: '[Contact]',
      resolver: async (office, args, { currentUser, Users, Contacts }) => {
        if (!office.contactIds) return []
        const contacts = _.compact(await Contacts.loader.loadMany(office.contactIds))
        return Users.restrictViewableFields(currentUser, Contacts, contacts)
      },
      addOriginalField: true
    },
    group: contactGroup
  },
  'contactIds.$': {
    type: Object,
    optional: true
  },
  'contactIds.$.value': {
    type: String,
    optional: true,
    label: 'contactId',
    description: 'contactId'
  },
  'contactIds.$.label': {
    type: String,
    optional: true,
    label: 'contactName',
    description: 'contactName'
  },
  'contactIds.$.title': {
    type: String,
    optional: true
  },

  // GraphQL-only fields to provide flexibility

  fullAddress: {
    label: 'Full Address',
    type: String,
    optional: true,
    canRead: 'guests',
    resolveAs: {
      type: 'String',
      resolver: (o) => getFullAddress(o)
    }
  },
  street: {
    label: 'Address',
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: (o) => {
        if (o.street1) {
          if (o.street2) {
            return o.street1 + ' ' + o.street2
          }
          return o.street1
        }
        return null
      }
    }
  },
  location: {
    label: 'Location',
    type: String,
    optional: true,
    canRead: 'guests',
    resolveAs: {
      type: 'String',
      resolver: (o) => {
        let state = ''
        if (o.state) {
          state = o.state.toLowerCase()
        }
        if (state === 'ca' || state.indexOf('calif') > -1) {
          return 'CA'
        }
        if (state === 'ny' || state === 'n.y.' || state === 'new york') {
          return 'NY'
        }
        return 'Other'
      }
    }
  }
}

export default schema
