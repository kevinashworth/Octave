import { Utils } from 'meteor/vulcan:core'
import SimpleSchema from 'simpl-schema'
import marked from 'marked'
// import Offices from '../offices/collection.js'
import { addressSubSchema, linkSubSchema } from '../shared_schemas.js'
import { CASTING_TITLES_ENUM } from '../constants.js'
import { getAddress, getFullAddress, getFullNameFromContact } from '../helpers.js'
import { logger } from '../logger.js'

const projectGroup = {
  name: 'projects',
  label: 'Projects',
  order: 10
}

const officeGroup = {
  name: 'officees',
  label: 'Offices (Preferred Over Addresses)',
  order: 20
}

const addressGroup = {
  name: 'addresses',
  label: 'Addresses (Not Available Under Offices)',
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

const projectSubSchema = new SimpleSchema({
  projectId: {
    type: String,
    control: 'SelectProjectIdNameTitle',
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
    hidden: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  titleForProject: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  }
})

const pastProjectSubSchema = new SimpleSchema({
  projectId: {
    type: String,
    control: 'SelectPastProjectIdNameTitle',
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
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
    canCreate: ['members'],
    canUpdate: ['members']
  },
  titleForProject: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  }
})

const officeSubSchema = new SimpleSchema({
  officeId: {
    type: String,
    control: 'MySelect',
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
    options: props => props.data.offices.results.map(o => ({
      value: o._id,
      label: o.displayName
    }))
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
    canRead: ['members']
  },

  // custom properties

  firstName: {
    label: 'First',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  middleName: {
    label: 'Middle',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  lastName: {
    label: 'Last',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  displayName: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
    onCreate: ({ document: contact }) => getFullNameFromContact(contact),
    onUpdate: ({ data, document: contact }) => {
      if (data.displayName) {
        return data.displayName
      }
      return getFullNameFromContact({
        firstName: data.firstName ? data.firstName : null,
        middleName: data.middleName ? data.middleName : null,
        lastName: data.lastName ? data.lastName : null
      })
    }
  },
  title: {
    label: 'Title',
    type: String,
    optional: true,
    input: 'select',
    options: () => {
      return CASTING_TITLES_ENUM
    },
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  gender: {
    label: 'Gender',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  // Body (Markdown)
  body: {
    label: 'Notes',
    type: String,
    optional: true,
    control: 'textarea',
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members']
  },
  // HTML version of Body
  htmlBody: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
    onCreate: ({ document: contact }) => {
      if (contact.body) {
        return Utils.sanitize(marked(contact.body))
      }
    },
    onUpdate: ({ data }) => {
      if (data.body) {
        return Utils.sanitize(marked(data.body))
      }
    }
  },
  links: {
    label: 'Links',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
    group: linkGroup
  },
  'links.$': {
    type: linkSubSchema
  },
  allLinks: {
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      resolver: (o) => {
        if (o.links) {
          const reduced = o.links.reduce(function (acc, cur) {
            return { theGoods: acc.theGoods + cur.platformName + cur.profileName + cur.profileLink }
          }, { theGoods: '' })
          return reduced.theGoods
        }
        return null
      }
    }
  },
  addresses: {
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
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
  addressString: {
    label: 'Computed Address String',
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
    onCreate: ({ document: contact }) => {
      try {
        return getFullAddress(getAddress({ contact }))
      } catch (e) {
        logger.groupCollapsed('Error in addressString for ', contact._id, ':')
        logger.error(e)
        logger.groupEnd()
        return 'Error in onCreate'
      }
    },
    onUpdate: ({ data }) => {
      try {
        return getFullAddress(getAddress({ contact: data }))
      } catch (e) {
        logger.groupCollapsed('Error in addressString for ', contact._id, ':')
        logger.error(e)
        logger.groupEnd()
        return 'Error in onUpdate'
      }
    }
  },
  // field to ease transition from address to addresses,
  // and also to provide a 'main' address
  // and this is used for caculating `location`
  theAddress: {
    label: 'Address Object',
    type: addressSubSchema,
    optional: true,
    canRead: ['members'],
    onCreate: ({ document }) => getAddress({ contact: document }),
    onUpdate: ({ document }) => getAddress({ contact: document }),
    defaultValue: {
      street1: 'theAddress',
      street2: 'isNotReadyYet',
      city: 'Someday',
      state: 'UT',
      zip: '88888',
      location: 'Unknown'
    }
    // resolveAs: {
    //   resolver: (o) => {
    //     var address = null
    //     try {
    //       address = getAddress({ contact: o })
    //     } catch (e) {
    //       logger.groupCollapsed('Error in theAddress for ', o._id, ':')
    //       logger.error(e)
    //       logger.groupEnd()
    //       return 'Blvd of Broken Dreams'
    //     }
    //     return address
    //   }
  },
  slug: {
    type: String,
    optional: true,
    canRead: 'guests',
    canCreate: ['members'],
    canUpdate: ['members'],
    onCreate: ({ document: contact }) => {
      return Utils.slugify(getFullNameFromContact(contact))
    },
    onUpdate: ({ data, document: contact }) => {
      if (data.slug) {
        return Utils.slugify(data.slug)
      }
      return Utils.slugify(getFullNameFromContact({
        firstName: data.firstName ? data.firstName : null,
        middleName: data.middleName ? data.middleName : null,
        lastName: data.lastName ? data.lastName : null
      }))
    }
  },
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

  // A contact has many offices
  offices: {
    label: 'Offices',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
    query: `
      offices{
        results{
          _id
          displayName
        }
      }
    `,
    group: officeGroup
  },
  'offices.$': {
    type: officeSubSchema
  },

  // A contact has many projects
  projects: {
    label: 'Projects',
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

  // A contact has many pastProjects
  pastProjects: {
    label: 'Past Projects',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
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

  // GraphQL only fields

  fullName: {
    label: 'Full Name',
    type: String,
    optional: true,
    canRead: 'guests',
    resolveAs: {
      type: 'String',
      resolver: (o) => getFullNameFromContact(o)
    }
  }
}

export default schema
