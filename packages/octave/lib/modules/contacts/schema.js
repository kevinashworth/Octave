import { Components, createSchema, Utils } from 'meteor/vulcan:core'
import React, { lazy, Suspense } from 'react'
import get from 'lodash/get'
import marked from 'marked'
import { addressSubSchema, linkSubSchema, officeSubSchema } from '../shared_schemas.js'
import { CASTING_TITLES_ENUM } from '../constants.js'
import { getAddress, getFullAddress, getFullNameFromContact } from '../helpers.js'

const MySelect = lazy(() => import('../../components/common/Forms/MySelect'))
// const SelectPastProjectIdTitle = lazy(() => import('../../components/common/Forms/SelectPastProjectIdTitle'))
const SelectProjectIdTitle = lazy(() => import('../../components/common/Forms/SelectProjectIdTitle'))
const MySelectLazy = (props) => {
  return (
    <Suspense fallback={<Components.Loading />}>
      <MySelect {...props} />
    </Suspense>
  )
}
const SelectPastProjectIdTitleLazy = (props) => {
  return (
    <Suspense fallback={<Components.Loading />}>
      <SelectProjectIdTitle collectionName='pastProjects' {...props} />
    </Suspense>
  )
}
const SelectProjectIdTitleLazy = (props) => {
  return (
    <Suspense fallback={<Components.Loading />}>
      <SelectProjectIdTitle {...props} />
    </Suspense>
  )
}

const getHtmlBody = (contact) => {
  if (contact.body) {
    return Utils.sanitize(marked(contact.body))
  } else {
    return null
  }
}

const getAddressString = (contact) => {
  try {
    return getFullAddress(getAddress({ contact }))
  } catch (e) {
    console.group('Error in addressString for ', contact._id, ':')
    console.error(e)
    console.groupEnd()
    return 'Error in getAddressString'
  }
}

const projectGroup = {
  name: 'projects',
  label: 'Projects',
  order: 10
}

const officeGroup = {
  name: 'offices',
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

// NB: [past-]projects are different for offices than contacts
const projectSubSchema = createSchema({
  projectId: {
    type: String,
    input: SelectProjectIdTitleLazy,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
    options: props => get(props, 'data.projects.results', []).map(project => ({
      value: project._id,
      label: project.projectTitle
    }))
  },
  projectTitle: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  titleForProject: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  }
})

const pastProjectSubSchema = createSchema({
  projectId: {
    type: String,
    input: SelectPastProjectIdTitleLazy,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
    options: props => get(props, 'data.pastProjects.results', []).map(project => ({
      value: project._id,
      label: project.projectTitle
    }))
  },
  projectTitle: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  titleForProject: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
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
    onCreate: ({ document }) => {
      if (!document.createdAt) { // this keeps createdAt from mockaroo
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
    onCreate: ({ document }) => {
      if (!document.updatedAt) { // this keeps updatedAt from mockaroo
        return new Date()
      }
    },
    onUpdate: () => {
      return new Date()
    }
  },
  firstName: {
    label: 'First',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  middleName: {
    label: 'Middle',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  lastName: {
    label: 'Last',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  displayName: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
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
    type: String,
    optional: true,
    input: MySelectLazy,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
    options: CASTING_TITLES_ENUM
  },
  gender: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  // Body (Markdown)
  body: {
    label: 'Notes',
    type: String,
    optional: true,
    input: 'textarea',
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  // HTML version of Body
  htmlBody: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    onCreate: ({ document: contact }) => getHtmlBody(contact),
    onUpdate: ({ data: contact }) => getHtmlBody(contact)
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
  allLinks: {
    type: String,
    optional: true,
    canRead: ['members'],
    resolveAs: {
      resolver: (o) => {
        if (o.links) {
          const linkStrings = o.links.map(contact => contact.platformName + ' ' + contact.profileName + ' ' + contact.profileLink)
          return linkStrings.join(' ')
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
      resolver: (o) => {
        if (o.addresses) {
          const addressStrings = o.addresses.map(contact => getFullAddress(contact))
          return addressStrings.join(' ')
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
    onCreate: ({ document: contact }) => getAddressString(contact),
    onUpdate: ({ data: contact }) => getAddressString(contact)
  },
  // field to ease transition from address to addresses,
  // to provide a 'main' address, and used for caculating `location`
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
      city: '',
      state: '',
      zip: '',
      location: 'Unknown'
    }
  },
  slug: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
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

  // A contact has many offices
  offices: {
    label: 'Offices',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
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

  // A contact has many projects
  projects: {
    label: 'Projects',
    type: Array,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
    group: projectGroup,
    query: /* GraphQL */`
      query ProjectsTitleAndId {
        projects {
          results {
            _id
            projectTitle
          }
        }
      }
    `
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
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
    group: pastProjectGroup,
    query: /* GraphQL */`
      query PastProjectsTitleAndId {
        pastProjects {
          results {
            _id
            projectTitle
          }
        }
      }
    `
  },
  'pastProjects.$': {
    type: pastProjectSubSchema
  }
}

export default schema
