import { getActions, getStore } from 'meteor/vulcan:redux'
import Users from 'meteor/vulcan:users'
import React from 'react'
import { Link } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import sortBy from 'lodash/sortBy'
import Contacts from './contacts/collection.js'
import Offices from './offices/collection.js'
import Projects from './projects/collection.js'
import {
  BROADCAST_ENUM,
  CABLE_ENUM,
  PAYTV_ENUM,
  SVOD_ENUM,
  AVOD_ENUM,
  DATE_FORMAT_LONG,
  DATE_FORMAT_SHORT,
  CASTING_TITLES_SORT_ORDER
} from './constants.js'
import { getProcessMongo } from '../server/helpers.js'
import moment from 'moment'

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
    return 'getFullNameFromContact error'
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

// creates a string with no formatting
export const createPlainAddress = (office) => {
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

// creates address with line breaks and map link
// export const createdFormattedAddress = (office) => {
//   let streetAddress = ''
//   if (office.street1) {
//     streetAddress = office.street1 + '<br/>'
//   }
//   if (office.street2 && office.street2.trim().length > 0) {
//     streetAddress += office.street2 + '<br/>'
//   }
//   if (office.city) {
//     streetAddress += office.city + ', '
//   }
//   if (office.state) {
//     streetAddress += office.state
//   }
//   if (office.zip) {
//     streetAddress += '  ' + office.zip
//   }
//   if (office.street1 && office.city && office.state) {
//     streetAddress += `<br/><small><a href="https://maps.google.com/?q=${office.street1},${office.city},${office.state}" target="googlemaps">Open in Google Maps</a></small>`
//   }
//   return streetAddress
// }

// copied from Vulcan/packages/vulcan-forms/lib/modules/utils.js
export const isEmptyValue = value => (typeof value === 'undefined' || value === null || value === '' || Array.isArray(value) && value.length === 0 || Array.isArray(value) && value.length === 1 && Object.keys(value[0]).length === 0 && value[0].constructor === Object) // eslint-disable-line

export const getLocation = (address) => { // have to repeat theState code, not available on its own
  let state = null
  try {
    state = address.state.toLowerCase()
  } catch (e) {
    // eslint-disable-next-line no-console
    // console.error(e)
    return 'Unknown'
  }
  if (!state) {
    return 'Unknown'
  }
  if (state === 'ca' || state.indexOf('calif') > -1) {
    return 'Calif.'
  }
  if (state === 'ny' || state === 'n.y.' || state === 'new york') {
    return 'NY'
  }
  if (state === 'ab' || state === 'bc' || state === 'mb' || state === 'ns' || state === 'on' || state === 'qc') {
    return 'Canada'
  }
  if (state === 'uk' || state === 'u.k.' || state === 'ie' || state === 'ir' || state === 'irl') {
    return 'Europe'
  }
  return 'Other'
}

export const getAddress = ({ project, office, contact }) => {
  // get the first address we find, always looking in this order:
  // office, project, contact.
  // stop when we find an address with a `state`.
  const blankAddress = {
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
    if (isEqual(address, blankAddress) && !isEmptyValue(office.projects)) {
      for (let i = 0; i < office.projects.length; i++) {
        address = findProjectAddress(office.projects[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (isEqual(address, blankAddress) && !isEmptyValue(office.contacts)) {
      for (let i = 0; i < office.contacts.length; i++) {
        address = findContactAddress(office.contacts[i])
        if (address.state.length) {
          break
        }
      }
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
    if (isEqual(address, blankAddress) && !isEmptyValue(project.offices)) {
      for (let i = 0; i < project.offices.length; i++) {
        address = findOfficeAddress(project.offices[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (isEqual(address, blankAddress) && !isEmptyValue(project.contacts)) {
      for (let i = 0; i < project.contacts.length; i++) {
        address = findContactAddress(project.contacts[i])
        if (address.state.length) {
          break
        }
      }
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
    if (isEqual(address, blankAddress) && !isEmptyValue(contact.offices)) {
      for (let i = 0; i < contact.offices.length; i++) {
        address = findOfficeAddress(contact.offices[i])
        if (address.state.length) {
          break
        }
      }
    }
    if (isEqual(address, blankAddress) && !isEmptyValue(contact.projects)) {
      for (let i = 0; i < contact.projects.length; i++) {
        address = findProjectAddress(contact.projects[i])
        if (address.state.length) {
          break
        }
      }
    }
  }

  if (!isEqual(address, blankAddress)) {
    address.location = getLocation(address)
    return address
  } else {
    return blankAddress
  }
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
  const sorted = sortBy([contact.updatedAt, office.updatedAt, project.updatedAt])
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
  let keys
  let sortFn

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

// lowercase sortTitle because `views` are case-sensitive
export function getSortTitle (title) {
  const theTitle = title.trim().toLowerCase()
  const firstSpace = theTitle.indexOf(' ')
  const firstWord = theTitle.slice(0, firstSpace)
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

/* for DataTables */

// export function dateFormatter (cell, row) {
//   return moment(cell).format(DATE_FORMAT_SHORT)
// }

export function dateFormatter (cell, row) {
  let theDate
  if (!cell) { // i.e. there is only a createdAt, not an updatedAt
    theDate = row.createdAt
  } else {
    theDate = cell
  }
  return moment(theDate).format(DATE_FORMAT_SHORT)
}

export function renderShowsTotal (start, to, total) {
  return (
    <span>
      Showing {start} to {to} out of {total} &nbsp;&nbsp;
    </span>
  )
}

export function titleSortFunc (a, b, order) {
  if (a.sortTitle && b.sortTitle) {
    if (order === 'asc') {
      return a.sortTitle.localeCompare(b.sortTitle)
    } else {
      return b.sortTitle.localeCompare(a.sortTitle)
    }
  } else {
    if (order === 'asc') {
      return getSortTitle(a.projectTitle).localeCompare(getSortTitle(b.projectTitle))
    } else {
      return getSortTitle(b.projectTitle).localeCompare(getSortTitle(a.projectTitle))
    }
  }
}

export const compareCastingTitles = (a, b) => {
  const aOrder = CASTING_TITLES_SORT_ORDER.indexOf(a.title)
  const bOrder = CASTING_TITLES_SORT_ORDER.indexOf(b.title)
  if (aOrder < 0 || bOrder < 0) {
    return 0
  }
  if (aOrder < bOrder) {
    return -1
  }
  if (aOrder > bOrder) {
    return 1
  }
  return 0
}

export const getMongoProvider = () => {
  if (Meteor.isClient) {
    Meteor.call('getProcessEnvMongoProvider', function (err, results) {
      if (err) {
        console.error('getProcessEnvMongoProvider error:', err)
      }
      const { setMongoProvider } = getActions()
      getStore().dispatch(setMongoProvider(results))
      return results
    })
  } else if (Meteor.isServer) {
    return getProcessMongo()
  } else {
    return 'getMongoProvider error'
  }
}

export const setMongoProvider = () => {
  if (Meteor.isClient) {
    Meteor.call('getProcessEnvMongoProvider', function (err, results) {
      if (err) {
        console.error('getProcessEnvMongoProvider error:', err)
      }
      const { setMongoProvider } = getActions()
      getStore().dispatch(setMongoProvider(results))
    })
  } else {
    return 'setMongoProvider error'
  }
}

export const seasonOrder = (project) => {
  if (!project || !project.season) {
    return null
  }
  let so = 'Season Info Missing'
  if (project.renewed && (project.status === 'On Hiatus' || project.status === 'Ordered')) {
    so = `Renewed for Season ${project.season}`
  } else if (project.status === 'On Hiatus' || project.status === 'Wrapped' || project.status === 'Canceled') {
    so = `Completed Season ${project.season}`
  }
  if (project.status === 'Casting' || project.status === 'Pre-Prod.' || project.status === 'See Notes' || project.status === 'Suspended' || project.status === 'Undetermined') {
    so = `Season ${project.season}`
  }
  if (project.order) {
    so += ` (${project.order}-episode order)`
  }
  return so
}

export const displayDates = (itemName, item) => {
  return `${itemName} added to database ` + moment(item.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
    'Last modified ' + moment(item.updatedAt).format(DATE_FORMAT_LONG)
}

export const isEditor = (currentUser) => {
  const isAdmin = Users.isAdmin(currentUser)
  const isEditor = Users.isMemberOf(currentUser, 'editors')
  const isEditorOrAdmin = isAdmin || isEditor
  return isEditorOrAdmin
}
