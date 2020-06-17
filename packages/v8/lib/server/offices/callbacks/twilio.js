/* eslint-disable no-undef */
/*
 * Use Twilio Lookup for Validation and Formatting
 */
import isEqual from 'lodash/isEqual'

export async function OfficeUpdateFormatPhones (data, { document, originalDocument }) {
  if (isEqual(document.phones, originalDocument.phones)) {
    return data
  }
  if (Meteor.settings.private && Meteor.settings.private.twilio && document.phones && document.phones.length) {
    const accountSid = Meteor.settings.private.twilio.accountSid
    const authToken = Meteor.settings.private.twilio.authToken
    const client = require('twilio')(accountSid, authToken)

    const vfnPhones = await Promise.all(
      document.phones.map(async phone => {
        const vfn = await client.lookups.phoneNumbers(phone.phoneNumberAsInput).fetch({ countryCode: 'US' })
        const vfnPhone = {
          phoneNumberAsInput: phone.phoneNumberAsInput,
          phoneNumberType: phone.phoneNumberType,
          phoneNumber: vfn.phoneNumber,
          nationalFormat: vfn.nationalFormat
        }
        return vfnPhone
      })
    )
    const updatedData = data
    updatedData.phones = vfnPhones
    return updatedData
  } else {
    return data
  }
}

export async function OfficeCreateFormatPhones (document) {
  if (Meteor.settings.private && Meteor.settings.private.twilio && document.phones && document.phones.length) {
    const accountSid = Meteor.settings.private.twilio.accountSid
    const authToken = Meteor.settings.private.twilio.authToken
    const client = require('twilio')(accountSid, authToken)

    const vfnPhones = await Promise.all(
      document.phones.map(async phone => {
        const vfn = await client.lookups.phoneNumbers(phone.phoneNumberAsInput).fetch({ countryCode: 'US' })
        const vfnPhone = {
          phoneNumberAsInput: phone.phoneNumberAsInput,
          phoneNumberType: phone.phoneNumberType,
          phoneNumber: vfn.phoneNumber,
          nationalFormat: vfn.nationalFormat
        }
        return vfnPhone
      })
    )
    const updatedDocument = document
    updatedDocument.phones = vfnPhones
    return updatedDocument
  } else {
    return document
  }
}
