import { Utils } from 'meteor/vulcan:core'
import SimpleSchema from 'simpl-schema'
import marked from 'marked'
import { addressSubSchema, linkSubSchema } from '../shared_schemas.js'
import { getFullAddress, isEmptyValue } from '../helpers.js'

// import _ from 'lodash'

// function getContactsAsOptions (contacts) {
//   return contacts.map(contact => ({
//     value: contact._id,
//     label: contact.fullName
//   }))
// }

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

const pastProjectGroup = {
  name: 'pastProjects',
  label: 'Past Projects',
  order: 50,
  startCollapsed: true
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
    canUpdate: ['members', 'admins'],
  },
  contactTitle: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
  }
})

const projectSubSchema = new SimpleSchema({
  projectId: {
    type: String,
    label: 'Project',
    input: 'MySelect',
    inputProperties: {
      selectMulti: true
    },
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    options: props => props.data.projects.results.map(project => ({
      value: project._id,
      label: project.projectTitle
    }))
  },
  projectTitle: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members']
  }
})

const pastProjectSubSchema = new SimpleSchema({
  projectId: {
    type: String,
    label: 'Past Project',
    input: 'MySelect',
    inputProperties: {
      selectMulti: true
    },
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    options: props => props.data.pastProjects.results.map(project => ({
      value: project._id,
      label: project.projectTitle
    }))
  },
  projectTitle: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members']
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

  displayName: {
    label: 'Display Name',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
  },
  // Body (Markdown)
  body: {
    label: 'Notes',
    type: String,
    optional: true,
    control: 'textarea', // use a textarea form component
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
  },
  // HTML version of Body
  htmlBody: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    onInsert: (o) => {
      if (o.body) {
        return Utils.sanitize(marked(o.body))
      }
    },
    onEdit: (modifier, o) => {
      if (modifier.$set.body) {
        return Utils.sanitize(marked(modifier.$set.body))
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
    canRead: ['members'],
    onInsert: (o) => {
      return Utils.slugify(o.displayName)
    },
    onEdit: (modifier, o) => {
      if (modifier.$set.displayName) {
        return Utils.slugify(modifier.$set.displayName)
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
    canRead: ['guests'],
    onInsert: () => {
      return new Date()
    },
    onEdit: () => {
      return new Date()
    }
  },

  // An office has many projects
  projects: {
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    query: `
      projects{
        results{
          _id
          projectTitle
        }
      }
    `,
    group: projectGroup,
    resolveAs: {
      fieldName: 'theProjects',
      type: '[Project]',
      resolver: (office, args, { Projects }) => {
        if (isEmptyValue(office.projects)) return []
        const projectIds = office.projects.map(function (p) {
          return p.projectId
        })
        const projects = Projects.find(
          {
            _id: { $in: projectIds }
          }, {
            limit: 50, // TODO: Does any limit really make sense?
            sort: { status: 1, sortTitle: 1 } // Case-sensitive, alas
          }
        ).fetch()
        return projects
      },
      addOriginalField: true
    }
  },
  'projects.$': {
    type: projectSubSchema
  },

  // A contact has many pastProjects
  pastProjects: {
    label: 'Past Projects',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    query: `
      pastProjects{
        results{
          _id
          projectTitle
        }
      }
    `,
    group: pastProjectGroup
  },
  'pastProjects.$': {
    type: pastProjectSubSchema
  },

  // An office has many contacts
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
    group: contactGroup,
    resolveAs: {
      fieldName: 'theContacts',
      type: '[Contact]',
      resolver: (office, args, { Contacts }) => {
        if (isEmptyValue(office.contacts)) return []
        const contactIds = office.contacts.map(function (o) {
          return o.contactId
        })
        const contacts = Contacts.find(
          {
            _id: { $in: contactIds }
          }, {
            sort: { title: -1, lastName: 1 }
          }
        ).fetch()
        return contacts
      },
      addOriginalField: true
    }
  },
  'contacts.$': {
    type: contactSchema
  },
  allContactNames: {
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      resolver: (o) => {
        if (o.contacts) {
          const reduced = o.contacts.reduce(function (acc, cur) {
            return { contactName: acc.contactName + ' ' + cur.contactName }
          }, { contactName: '' })
          return reduced.contactName
        }
        return null
      }
    }
  },

  // GraphQL-only fields to provide flexibility

  fullAddress: {
    label: 'Full Address',
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: (o) => {
        if (o.addresses && o.addresses[0]) {
          return getFullAddress(o.addresses[0])
        }
        return null
      }
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
    canRead: ['guests'],
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
  },

  // GraphQL only fields to ease transition from address to addresses, and also to provide a 'main' address

  theStreet: {
    label: 'Address',
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: (o) => {
        if (o.theStreet2) {
          return o.theStreet1 + ' ' + o.theStreet2
        }
        return o.theStreet1
      }
    }
  },
  theStreet1: {
    label: 'Address',
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: (o) => {
        try {
          if (!isEmptyValue(o.addresses)) {
            return o.addresses[0].street1
          }
        } catch (e) {
          console.group('Error in theStreet1 for ', o._id, ':')
          console.error(e)
          console.groupEnd()
          return 'Blvd of Broken Dreams'
        }
        return null
      }
    }
  },
  theStreet2: {
    label: '(cont)',
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: (o) => {
        try {
          if (!isEmptyValue(o.addresses)) {
            return o.addresses[0].street2
          }
        } catch (e) {
          console.group('Error in theStreet2 for ', o._id, ':')
          console.error(e)
          console.groupEnd()
          return 'Suite Nothing'
        }
        return null
      }
    }
  },
  theCity: {
    label: 'City',
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: (o) => {
        try {
          if (!isEmptyValue(o.addresses)) {
            return o.addresses[0].city
          }
        } catch (e) {
          console.group('Error in theCity for ', o._id, ':')
          console.error(e)
          console.groupEnd()
          return 'Leicester City'
        }
        return null
      }
    }
  },
  theState: {
    label: 'State',
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: (o) => {
        try {
          if (!isEmptyValue(o.addresses)) {
            return o.addresses[0].state
          }
        } catch (e) {
          console.group('Error in theState for ', o._id, ':')
          console.error(e)
          console.groupEnd()
          return 'State of Denial'
        }
        return null
      }
    }
  },
  theLocation: {
    label: 'Location',
    type: String,
    optional: true,
    canRead: 'guests',
    resolveAs: {
      type: 'String',
      resolver: (o) => { // have to repeat theState code, not available on its own
        var state = ''
        try {
          if (!isEmptyValue(o.addresses)) {
            state = o.addresses[0].state.toLowerCase()
          }
        } catch (e) {
          console.group('Error in theLocation for ', o._id, ':')
          console.error(e)
          console.groupEnd()
          return 'Locomotion'
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
  },
  theZip: {
    label: 'Zip',
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      type: 'String',
      resolver: (o) => {
        if (!isEmptyValue(o.addresses)) {
          return o.addresses[0].zip
        }
        return null
      }
    }
  }
}

export default schema
