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
export const isEmptyValue = value => (typeof value === 'undefined' || value === null || value === '' || Array.isArray(value) && value.length === 0); // eslint-disable-line

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

export const getAddress = ({ contact, office, project }) => {
  // get the first address we find, always looking in this order:
  // first on the project, office, contact,
  // then on the first listing address listed in its projects, offices, contacts
  var theDummyAddress = {
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    location: 'Unknown'
  }
  var theAddress = theDummyAddress

  if (project) {
    if (!isEmptyValue(project.addresses)) {
      if (!isEmptyValue(project.addresses[0])) {
        theAddress = project.addresses[0]
        if (!_.isEqual(theAddress, theDummyAddress)) {
          theAddress.location = getLocation(theAddress)
          return theAddress
        }
      }
    }
    if (!isEmptyValue(project.offices)) {
      if (!isEmptyValue(project.offices[0])) {
        const office = Offices.findOne(project.offices[0].officeId)
        if (office) {
          if (!isEmptyValue(office.addresses)) {
            if (!isEmptyValue(office.addresses[0])) {
              theAddress = office.addresses[0]
              if (!_.isEqual(theAddress, theDummyAddress)) {
                theAddress.location = getLocation(theAddress)
                return theAddress
              }
            }
          }
        }
      }
    }
    if (!isEmptyValue(project.contacts)) {
      if (!isEmptyValue(project.contacts[0])) {
        const contact = Contacts.findOne(project.contacts[0].contactId)
        if (contact) {
          if (!isEmptyValue(contact.addresses)) {
            if (!isEmptyValue(contact.addresses[0])) {
              theAddress = contact.addresses[0]
              if (!_.isEqual(theAddress, theDummyAddress)) {
                theAddress.location = getLocation(theAddress)
                return theAddress
              }
            }
          }
        }
      }
    }
  }

  if (office) {
    if (!isEmptyValue(office.addresses)) {
      if (!isEmptyValue(office.addresses[0])) {
        theAddress = office.addresses[0]
        if (!_.isEqual(theAddress, theDummyAddress)) {
          theAddress.location = getLocation(theAddress)
          return theAddress
        }
      }
    }
    if (!isEmptyValue(office.projects)) {
      if (!isEmptyValue(office.projects[0])) {
        const project = Projects.findOne(office.projects[0].projectId)
        if (project) {
          if (!isEmptyValue(project.addresses)) {
            if (!isEmptyValue(project.addresses[0])) {
              theAddress = project.addresses[0]
              if (!_.isEqual(theAddress, theDummyAddress)) {
                theAddress.location = getLocation(theAddress)
                return theAddress
              }
            }
          }
        }
      }
    }
    if (!isEmptyValue(office.contacts)) {
      if (!isEmptyValue(office.contacts[0])) {
        const contact = Contacts.findOne(office.contacts[0].officeId)
        if (contact) {
          if (!isEmptyValue(contact.addresses)) {
            if (!isEmptyValue(contact.addresses[0])) {
              theAddress = contact.addresses[0]
              if (!_.isEqual(theAddress, theDummyAddress)) {
                theAddress.location = getLocation(theAddress)
                return theAddress
              }
            }
          }
        }
      }
    }
  }

  if (contact) {
    if (!isEmptyValue(contact.addresses)) {
      if (!isEmptyValue(contact.addresses[0])) {
        theAddress = contact.addresses[0]
        if (!_.isEqual(theAddress, theDummyAddress)) {
          theAddress.location = getLocation(theAddress)
          return theAddress
        }
      }
    }
    if (!isEmptyValue(contact.projects)) {
      if (!isEmptyValue(contact.projects[0])) {
        const project = Projects.findOne(contact.projects[0].projectId)
        if (project) {
          if (!isEmptyValue(project.addresses)) {
            if (!isEmptyValue(project.addresses[0])) {
              theAddress = project.addresses[0]
              if (!_.isEqual(theAddress, theDummyAddress)) {
                theAddress.location = getLocation(theAddress)
                return theAddress
              }
            }
          }
        }
      }
    }
    if (!isEmptyValue(contact.offices)) {
      if (!isEmptyValue(contact.offices[0])) {
        const office = Offices.findOne(contact.offices[0].officeId)
        if (office) {
          if (!isEmptyValue(office.addresses)) {
            if (!isEmptyValue(office.addresses[0])) {
              theAddress = office.addresses[0]
              if (!_.isEqual(theAddress, theDummyAddress)) {
                theAddress.location = getLocation(theAddress)
                return theAddress
              }
            }
          }
        }
      }
    }
  }

  return theDummyAddress
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
