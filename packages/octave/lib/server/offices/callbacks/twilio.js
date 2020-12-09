/* Use Twilio Lookup for Validation and Formatting */
import { getSetting } from 'meteor/vulcan:core'
import isEqual from 'lodash/isEqual'

const validateAndFormat = async (phones) => {
  try {
    const accountSid = Meteor.settings.private.twilio.accountSid
    const authToken = Meteor.settings.private.twilio.authToken
    const client = require('twilio')(accountSid, authToken)
    const vfPhones = await Promise.all(
      phones.map(async phone => {
        const vf = await client.lookups.phoneNumbers(phone.phoneNumberAsInput).fetch()
        const vfPhone = {
          phoneNumberAsInput: phone.phoneNumberAsInput,
          phoneNumberType: phone.phoneNumberType,
          phoneNumber: vf.phoneNumber,
          nationalFormat: vf.nationalFormat,
          countryCode: vf.countryCode
        }
        return vfPhone
      })
    )
    return vfPhones
  } catch (e) {
    console.error('Twilio / validateAndFormat error:', e)
    return phones
  }
}

export async function OfficeUpdateFormatPhones (data, { document, originalDocument }) {
  if (isEqual(document.phones, originalDocument.phones)) {
    return data
  }
  if (document.phones && document.phones.length) {
    const vfPhones = await validateAndFormat(document.phones)
    data.phones = vfPhones
    return data
  } else {
    return data
  }
}

export async function OfficeCreateFormatPhones (document) {
  if (getSetting('mockaroo.seedDatabase')) {
    return document
  }
  if (document.phones && document.phones.length) {
    const vfPhones = await validateAndFormat(document.phones)
    document.phones = vfPhones
    return document
  } else {
    return document
  }
}
