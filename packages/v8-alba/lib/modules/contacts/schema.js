import { Utils } from 'meteor/vulcan:core'
import SimpleSchema from 'simpl-schema'
import marked from 'marked'
import { addressSchema } from '../shared_schemas.js'
import { CASTING_TITLES_ENUM } from '../constants.js'
import { getFullAddress, getFullNameFromContact, isEmptyValue } from '../helpers.js'
import Places from '../places/collection.js'

const addressGroup = {
  name: 'addresses',
  label: 'Addresses',
  order: 5
}

const projectGroup = {
  name: 'projects',
  label: 'Projects',
  order: 10
}

const linkGroup = {
  name: 'links',
  label: 'Links',
  order: 20
}

export const linkSchema = new SimpleSchema({
  platformName: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members']
  },
  profileName: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members']
  },
  profileLink: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members']
  }
})

export const projectSchema = new SimpleSchema({
  projectId: {
    type: String,
    control: 'SelectProjectIdNameTitle',
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members'],
    options: props => props.data.projects.results.map(project => ({
      value: project._id,
      label: project.projectTitle
    }))
  },
  projectTitle: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members']
  },
  titleForProject: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members']
  }
})

const schema = {
  // default properties

  _id: {
    type: String,
    optional: true,
    viewableBy: 'guests'
  },
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: 'guests',
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

  firstName: {
    label: 'First',
    type: String,
    optional: true,
    viewableBy: 'guests',
    insertableBy: ['members'],
    editableBy: ['members']
  },
  middleName: {
    label: 'Middle',
    type: String,
    optional: true,
    viewableBy: 'guests',
    insertableBy: ['members'],
    editableBy: ['members']
  },
  lastName: {
    label: 'Last',
    type: String,
    optional: true,
    viewableBy: 'guests',
    insertableBy: ['members'],
    editableBy: ['members']
  },
  displayName: {
    type: String,
    optional: true,
    viewableBy: 'guests',
    insertableBy: ['members'],
    editableBy: ['members'],
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
    viewableBy: 'guests',
    insertableBy: ['members'],
    editableBy: ['members']
  },
  gender: {
    label: 'Gender',
    type: String,
    optional: true,
    viewableBy: 'guests',
    insertableBy: ['members'],
    editableBy: ['members']
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
    insertableBy: ['members'],
    editableBy: ['members'],
    group: linkGroup
  },
  'links.$': {
    type: linkSchema
  },
  allLinks: {
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      resolver: (contact) => {
        if (contact.links) {
          const reduced = contact.links.reduce(function (acc, cur) {
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
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members'],
    group: addressGroup
  },
  'addresses.$': {
    type: addressSchema
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
  },
  slug: {
    type: String,
    optional: true,
    viewableBy: 'guests',
    insertableBy: ['members'],
    editableBy: ['members'],
    onInsert: (contact) => {
      return Utils.slugify(getFullNameFromContact(contact))
    },
    onEdit: (modifier, contact) => {
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
    viewableBy: 'guests',
    onInsert: () => {
      return new Date()
    },
    onEdit: () => {
      return new Date()
    }
  },

  // A contact has many projects

  projects: {
    label: 'Projects',
    type: Array,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members'],
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
    type: projectSchema
  },

  // projectsCount: {
  //   type: Number,
  //   optional: true,
  //   viewableBy: ['guests'],
  //   resolveAs: {
  //     type: 'Int',
  //     resolver: (contact, args, { Projects }) => {
  //       const projectsCount = Projects.find({ contactId: contact._id }).count();
  //       return projectsCount;
  //     },
  //   }
  // },
  // projects: {
  //   type: Object,
  //   optional: true,
  //   viewableBy: ['members'],
  //   resolveAs: {
  //     arguments: 'limit: Int = 5',
  //     type: '[Project]',
  //     resolver: (contact, { limit }, { currentUser, Users, Projects }) => {
  //       const projects = Projects.find({_id: {$in: contactIds}}, { limit }).fetch();
  //
  //       // restrict documents fields
  //       const viewableProjects = _.filter(projects, projects => Projects.checkAccess(currentUser, projects));
  //       const restrictedProjects = Users.restrictViewableFields(currentUser, Projects, viewableProjects);
  //
  //       return restrictedProjects;
  //     }
  //   }
  // },

  // GraphQL only fields

  fullName: {
    label: 'Full Name',
    type: String,
    optional: true,
    viewableBy: 'guests',
    resolveAs: {
      type: 'String',
      resolver: (contact) => getFullNameFromContact(contact)
    }
  },

  // GraphQL only fields to ease transition from address to addresses, and also to provide a 'main' address

  theStreet: {
    label: 'Address',
    type: String,
    optional: true,
    viewableBy: ['members'],
    resolveAs: {
      type: 'String',
      resolver: (contact) => {
        if (contact.theStreet2) {
          return contact.theStreet1 + ' ' + contact.theStreet2
        }
        return contact.theStreet1
      }
    }
  },
  theStreet1: {
    label: 'Address',
    type: String,
    optional: true,
    viewableBy: ['members'],
    resolveAs: {
      type: 'String',
      resolver: async (contact) => {
        try {
          if (!isEmptyValue(contact.addresses)) {
            return contact.addresses[0].street1
          }
          if (!isEmptyValue(contact.places)) {
            const theId = contact.places[0].placeId
            const place = await Places.loader.load(theId);
            return place.street1
          }
        }
        catch(e) {
          // eslint-disable-next-line no-console
          console.info('Problem in theStreet1 for', contact._id)
          // eslint-disable-next-line no-console
          console.error(e)
          return "Blvd of Broken Dreams"
        }
        return null
      }
    }
  },
  theStreet2: {
    label: '(cont)',
    type: String,
    optional: true,
    viewableBy: ['members'],
    resolveAs: {
      type: 'String',
      resolver: async (contact) => {
        try {
          if (!isEmptyValue(contact.addresses)) {
            return contact.addresses[0].street2
          }
          if (!isEmptyValue(contact.places)) {
            const theId = contact.places[0].placeId
            const place = await Places.loader.load(theId);
            return place.street2
          }
        }
        catch(e) {
          // eslint-disable-next-line no-console
          console.info('Problem in theStreet2 for', contact._id)
          // eslint-disable-next-line no-console
          console.error(e)
          return "Suite Nothing"
        }
        return null
      }
    }
  },
  theCity: {
    label: 'City',
    type: String,
    optional: true,
    viewableBy: ['members'],
    resolveAs: {
      type: 'String',
      resolver: async (contact) => {
        try {
          if (!isEmptyValue(contact.addresses)) {
            return contact.addresses[0].city
          }
          if (!isEmptyValue(contact.places)) {
            const theId = contact.places[0].placeId
            const place = await Places.loader.load(theId);
            return place.city
          }
        }
        catch(e) {
          // eslint-disable-next-line no-console
          console.info('Problem in theCity for', contact._id)
          // eslint-disable-next-line no-console
          console.error(e)
          return "Leicester City"
        }
        return null
      }
    }
  },
  theState: {
    label: 'State',
    type: String,
    optional: true,
    viewableBy: ['members'],
    resolveAs: {
      type: 'String',
      resolver: async (contact) => {
        try {
          if (!isEmptyValue(contact.addresses)) {
            return contact.addresses[0].state
          }
          if (!isEmptyValue(contact.places)) {
            const theId = contact.places[0].placeId
            const place = await Places.loader.load(theId);
            return place.state
          }
        }
        catch(e) {
          // eslint-disable-next-line no-console
          console.info('Problem in theState for', contact._id)
          // eslint-disable-next-line no-console
          console.error(e)
          return "State of Denial"
        }
        return null
      }
    }
  },
  theLocation: {
    label: 'Location',
    type: String,
    optional: true,
    viewableBy: 'guests',
    resolveAs: {
      type: 'String',
      resolver: (contact) => {
        let state = ''
        if (contact.state) {
          state = contact.state.toLowerCase()
        }
        if (!isEmptyValue(contact.addresses)) {
          state = contact.addresses[0].state.toLowerCase()
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
    viewableBy: ['members'],
    resolveAs: {
      type: 'String',
      resolver: (contact) => {
        if (!isEmptyValue(contact.addresses)) {
          return contact.addresses[0].zip
        }
        return null
      }
    }
  }

}

export default schema
