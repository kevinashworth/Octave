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
    canRead: 'guests',
    canCreate: ['members'],
    canUpdate: ['members']
  },
  middleName: {
    label: 'Middle',
    type: String,
    optional: true,
    canRead: 'guests',
    canCreate: ['members'],
    canUpdate: ['members']
  },
  lastName: {
    label: 'Last',
    type: String,
    optional: true,
    canRead: 'guests',
    canCreate: ['members'],
    canUpdate: ['members']
  },
  displayName: {
    type: String,
    optional: true,
    canRead: 'guests',
    canCreate: ['members'],
    canUpdate: ['members'],
    onInsert: (contact) => getFullNameFromContact(contact),
    onEdit: (modifier, contact) => {
      if (modifier.$set.displayName) {
        return modifier.$set.displayName
      }
      return getFullNameFromContact({
        firstName: modifier.$set.firstName ? modifier.$set.firstName : null,
        middleName: modifier.$set.middleName ? modifier.$set.middleName : null,
        lastName: modifier.$set.lastName ? modifier.$set.lastName : null
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
    canRead: 'guests',
    canCreate: ['members'],
    canUpdate: ['members']
  },
  gender: {
    label: 'Gender',
    type: String,
    optional: true,
    canRead: 'guests',
    canCreate: ['members'],
    canUpdate: ['members']
  },
  // Body (Markdown)
  body: {
    label: 'Notes',
    type: String,
    optional: true,
    control: 'textarea',
    canRead: ['members', 'admins'],
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
    onCreate: ({ newDocument, currentUser }) => {
      try {
        return getFullAddress(getAddress({ contact: newDocument }))
      } catch (e) {
        logger.groupCollapsed('Error in addressString for ', newDocument._id, ':')
        logger.error(e)
        logger.groupEnd
        return ''
      }
    },
    onUpdate: ({ data, document, currentUser }) => {
      try {
        return getFullAddress(getAddress({ contact: document }))
      } catch (e) {
        logger.groupCollapsed('Error in addressString for ', document._id, ':')
        logger.error(e)
        logger.groupEnd
        return ''
      }
    }
  },
  slug: {
    type: String,
    optional: true,
    canRead: 'guests',
    canCreate: ['members'],
    canUpdate: ['members'],
    onInsert: (o) => {
      return Utils.slugify(getFullNameFromContact(o))
    },
    onEdit: (modifier, o) => {
      if (modifier.$set.slug) {
        return Utils.slugify(modifier.$set.slug)
      }
      return Utils.slugify(getFullNameFromContact({
        firstName: modifier.$set.firstName ? modifier.$set.firstName : null,
        middleName: modifier.$set.middleName ? modifier.$set.middleName : null,
        lastName: modifier.$set.lastName ? modifier.$set.lastName : null
      }))
    }
    // onEdit: (modifier, contact) => {
    //   if (modifier.$set.firstName || modifier.$set.middleName || modifier.$set.lastName) {
    //     return Utils.slugify(contact.displayName);
    //   }
    // }
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
  },

  // GraphQL only field to ease transition from address to addresses,
  // and also to provide a 'main' address
  // and this is used for caculating `location`

  theAddress: {
    label: 'Address Object',
    type: addressSubSchema,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      resolver: (o) => {
        var address = null
        try {
          address = getAddress({ contact: o })
        } catch (e) {
          logger.groupCollapsed('Error in theAddress for ', o._id, ':')
          logger.error(e)
          logger.groupEnd
          return 'Blvd of Broken Dreams'
        }
        return address
      }
    }
  }
}

export default schema
