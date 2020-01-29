import { Utils } from 'meteor/vulcan:core'
import SimpleSchema from 'simpl-schema'
import marked from 'marked'
import { addressSubSchema, contactSubSchema, linkSubSchema, phoneSubSchema } from '../shared_schemas.js'
import { getFullAddress, isEmptyValue } from '../helpers.js'

const contactGroup = {
  name: 'contacts',
  label: 'Contacts',
  order: 10
}

const addressGroup = {
  name: 'addresses',
  label: 'Addresses',
  order: 20
}

const phoneGroup = {
  name: 'phones',
  label: 'Phone Numbers',
  order: 25
}

const linkGroup = {
  name: 'links',
  label: 'Links',
  order: 30
}

const projectGroup = {
  name: 'projects',
  label: 'Projects',
  order: 40
}

const pastProjectGroup = {
  name: 'pastProjects',
  label: 'Past Projects',
  order: 50,
  startCollapsed: true
}

const projectSubSchema = new SimpleSchema({
  projectId: {
    type: String,
    label: 'Project',
    input: 'MySelect',
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
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  }
})

const pastProjectSubSchema = new SimpleSchema({
  projectId: {
    type: String,
    label: 'Past Project',
    input: 'MySelect',
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
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  }
})

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
    onCreate: () => {
      return new Date()
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
  displayName: {
    label: 'Display Name',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  slug: {
    type: String,
    optional: true,
    canRead: ['members'],
    onCreate: ({ document }) => {
      return Utils.slugify(document.displayName)
    },
    onUpdate: ({ data }) => {
      if (data.slug) {
        return Utils.slugify(data.slug)
      }
      if (data.displayName) {
        return Utils.slugify(data.displayName)
      }
    }
  },

  // Body (Markdown)
  body: {
    label: 'Notes',
    type: String,
    optional: true,
    input: 'textarea',
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  // HTML version of Body
  htmlBody: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    onCreate: ({ document }) => {
      if (document.body) {
        return Utils.sanitize(marked(document.body))
      }
    },
    onUpdate: ({ data }) => {
      if (data.body && data.body.length) {
        return Utils.sanitize(marked(data.body))
      } else {
        return null
      }
    }
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
      contacts {
        results {
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
    type: contactSubSchema
  },
  allContactNames: {
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      resolver: (o) => {
        if (o.contacts) {
          const contactNames = o.contacts.map(contact => contact.contactName)
          return contactNames.join(' ')
        }
        return null
      }
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
      projects {
        results {
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

  // An office has many links
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

  // An office has many addresses
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
          const addressStrings = o.addresses.map(office => getFullAddress(office))
          return addressStrings.join(' ')
        }
        return null
      }
    }
  },

  // An office has many phones
  phones: {
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    group: phoneGroup
  },
  'phones.$': {
    type: phoneSubSchema
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
      pastProjects {
        results {
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
