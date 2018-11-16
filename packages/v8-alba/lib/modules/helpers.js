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
