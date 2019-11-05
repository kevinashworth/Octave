import { Utils } from 'meteor/vulcan:core'
import marked from 'marked'
import _ from 'lodash'
import Contacts from './contacts/collection.js'
import Offices from './offices/collection.js'
import Projects from './projects/collection.js'
import {
  BROADCAST_ENUM,
  CABLE_ENUM,
  PAYTV_ENUM,
  SVOD_ENUM,
  AVOD_ENUM
} from './constants.js'

export function getFullNameFromContact ({ firstName, middleName, lastName }) {
  let tempName = ''
  if (firstName) {
    tempName += firstName
  }
  if (middleName) {
    tempName += (' ' + middleName)
  }
  if (lastName) {
    tempName += (' ' + lastName)
  }
  if (tempName.length) {
    return tempName
  } else {
    return 'displayName or fullName Unknown'
  }
}

export function getFullAddress ({ street1, street2, city, state, zip }) {
  let tempAddress = ''
  if (street1) {
    tempAddress += street1
  }
  if (street2) {
    tempAddress += (' ' + street2)
  }
  if (city) {
    tempAddress += (' ' + city)
  }
  if (state) {
    tempAddress += (' ' + state)
  }
  if (zip) {
    tempAddress += (' ' + zip)
  }
  if (tempAddress.length) {
    return tempAddress
  } else {
    return null
  }
}

export const createAddress = (office) => {
  if (!office) {
    return {
      street1: '',
      city: '',
      state: '',
      zip: ''
    }
  }
  let streetAddress = ''
  if (office.street1) {
    streetAddress = office.street1 + ' '
  }
  if (office.street2) {
    streetAddress += office.street2 + ' '
  }
  if (office.city) {
    streetAddress += office.city + ', '
  }
  if (office.state) {
    streetAddress += office.state + ' '
  }
  if (office.zip) {
    streetAddress += office.zip
  }
  return streetAddress
}

export const dangerouslyCreateAddress = (office) => {
  let streetAddress = ''
  if (office.street1) {
    streetAddress = office.street1 + '<br/>'
  }
  if (office.street2 && office.street2.trim().length > 0) {
    streetAddress += office.street2 + '<br/>'
  }
  if (office.city) {
    streetAddress += office.city + ', '
  }
  if (office.state) {
    streetAddress += office.state
  }
  if (office.zip) {
    streetAddress += '  ' + office.zip
  }
  if (office.street1 && office.city && office.state) {
    streetAddress += `<br/><small><a href="https://maps.google.com/?q=${office.street1},${office.city},${office.state}" target="_maps">Open in Google Maps</a></small>`
  }
  return { __html: streetAddress }
}

// copied from Vulcan/packages/vulcan-forms/lib/modules/utils.js
export const isEmptyValue = value => (typeof value === 'undefined' || value === null || value === '' || Array.isArray(value) && value.length === 0 || Array.isArray(value) && value.length === 1 && Object.keys(value[0]).length === 0 && value[0].constructor === Object) // eslint-disable-line

export const getLocation = (address) => { // have to repeat theState code, not available on its own
  var state = null
  try {
    state = address.state.toLowerCase()
  } catch (e) {
    // eslint-disable-next-line no-console
    // console.error(e)
    return 'Other'
  }
  if (!state) {
    return 'Other'
  }
  if (state === 'ca' || state.indexOf('calif') > -1) {
    return 'CA'
  }
  if (state === 'ny' || state === 'n.y.' || state === 'new york') {
    return 'NY'
  }
  return 'Other'
}

export const getAddress = ({ project, office, contact }) => {
  // get the first address we find, always looking in this order:
  // office, project, contact.
  // stop when we find an address with a `state`.
  var blankAddress = {
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    location: 'Unknown'
  }
  let address = blankAddress

  if (office) {
    if (!isEmptyValue(office.addresses)) {
      for (let i = 0; i < office.addresses.length; i++) {
        address = findAddress(office.addresses[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (_.isEqual(address, blankAddress) && !isEmptyValue(office.projects)) {
      for (let i = 0; i < office.projects.length; i++) {
        address = findProjectAddress(office.projects[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (_.isEqual(address, blankAddress) && !isEmptyValue(office.contacts)) {
      for (let i = 0; i < office.contacts.length; i++) {
        address = findContactAddress(office.contacts[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (!_.isEqual(address, blankAddress)) {
      if (!address.location) {
        address.location = getLocation(address)
      }
      return address
    }
  }

  if (project) {
    if (!isEmptyValue(project.addresses)) {
      for (let i = 0; i < project.addresses.length; i++) {
        address = findAddress(project.addresses[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (_.isEqual(address, blankAddress) && !isEmptyValue(project.offices)) {
      for (let i = 0; i < project.offices.length; i++) {
        address = findOfficeAddress(project.offices[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (_.isEqual(address, blankAddress) && !isEmptyValue(project.contacts)) {
      for (let i = 0; i < project.contacts.length; i++) {
        address = findContactAddress(project.contacts[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (!_.isEqual(address, blankAddress)) {
      if (!address.location) {
        address.location = getLocation(address)
      }
      return address
    }
  }

  if (contact) {
    if (!isEmptyValue(contact.addresses)) {
      for (let i = 0; i < contact.addresses.length; i++) {
        address = findAddress(contact.addresses[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (_.isEqual(address, blankAddress) && !isEmptyValue(contact.offices)) {
      for (let i = 0; i < contact.offices.length; i++) {
        address = findOfficeAddress(contact.offices[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (_.isEqual(address, blankAddress) && !isEmptyValue(contact.projects)) {
      for (let i = 0; i < contact.projects.length; i++) {
        address = findProjectAddress(contact.projects[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (!_.isEqual(address, blankAddress)) {
      if (!address.location) {
        address.location = getLocation(address)
      }
      return address
    }
  }

  return blankAddress
}

const findProjectAddress = (project) => {
  if (!isEmptyValue(project)) {
    const theProject = project.projectId && Projects.findOne(project.projectId)
    if (theProject) {
      if (!isEmptyValue(theProject.addresses)) {
        for (let i = 0; i < theProject.addresses.length; i++) {
          const theAddress = findAddress(theProject.addresses[i])
          if (theAddress.state.length) {
            return theAddress
          }
        }
      }
    }
  }
  return {
    state: ''
  }
}

const findOfficeAddress = (office) => {
  if (!isEmptyValue(office)) {
    const theOffice = office.officeId && Offices.findOne(office.officeId)
    if (theOffice) {
      if (!isEmptyValue(theOffice.addresses)) {
        for (let i = 0; i < theOffice.addresses.length; i++) {
          const theAddress = findAddress(theOffice.addresses[i])
          if (theAddress.state.length) {
            return theAddress
          }
        }
      }
    }
  }
  return {
    state: ''
  }
}

const findContactAddress = (contact) => {
  if (!isEmptyValue(contact)) {
    const theContact = contact.contactId && Contacts.findOne(contact.contactId)
    if (theContact) {
      if (!isEmptyValue(theContact.addresses)) {
        for (let i = 0; i < theContact.addresses.length; i++) {
          const theAddress = findAddress(theContact.addresses[i])
          if (theAddress.state.length) {
            return theAddress
          }
        }
      }
    }
  }
  return {
    state: ''
  }
}

const findAddress = (address) => {
  if (address.state) {
    return address
  }
  return {
    state: ''
  }
}

export const getLatestAddress = ({ contact, office, project }) => {
  // which is most recently updated? THe contact, office or project? Use it's address.
  const sorted = _.sortBy([contact.updatedAt, office.updatedAt, project.updatedAt])
  return getAddress({ contact: sorted[0] })
}

export const getPlatformType = (project) => {
  if (project.projectType) {
    if (project.projectType.indexOf('Feature') === 0) {
      return 'Theatrical'
    }
    if (project.projectType.indexOf('TV Daytime') === 0) {
      return 'Network Code'
    }
    if (project.projectType.indexOf('TV Talk') === 0) {
      return 'Network Code'
    }
  }
  if (project.network) {
    if (BROADCAST_ENUM.indexOf(project.network) > -1) {
      return 'Broadcast'
    }
    if (CABLE_ENUM.indexOf(project.network) > -1) {
      return 'Cable'
    }
    if (PAYTV_ENUM.indexOf(project.network) > -1) {
      return 'Pay TV'
    }
    if (SVOD_ENUM.indexOf(project.network) > -1) {
      return 'SVOD'
    }
    if (AVOD_ENUM.indexOf(project.network) > -1) {
      return 'AVOD'
    }
  }
  return 'Other'
}

export function sortObjectByKeyNameList (object, sortWith) { // copied from sort-object-keys package`
  var keys
  var sortFn

  if (typeof sortWith === 'function') {
    sortFn = sortWith
  } else {
    keys = sortWith
  }
  return (keys || []).concat(Object.keys(object).sort(sortFn)).reduce(function (total, key) {
    total[key] = object[key]
    return total
  }, Object.create({}))
}

export function getSortTitle (title) {
  const theTitle = title.trim()
  const firstSpace = theTitle.indexOf(' ')
  const firstWord = theTitle.slice(0, firstSpace).toLowerCase()
  let newTitle = ''
  switch (firstWord) {
    case 'a':
    case 'an':
    case 'the':
      newTitle = theTitle.slice(firstSpace + 1)
      break
    default:
      newTitle = theTitle
  }
  return newTitle
}

export const externalizeNoteLinks = (s) => {
  const sanitizeMarked = Utils.sanitize(marked(s))
  const pattern = /a href=/g
  const externalizeLinks = sanitizeMarked.replace(pattern, 'a target="_notes" href=')
  return externalizeLinks
}
