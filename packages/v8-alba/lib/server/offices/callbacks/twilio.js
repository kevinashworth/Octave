import _ from 'lodash'

const accountSid = Meteor.settings.private.twilio.accountSid
const authToken  = Meteor.settings.private.twilio.authToken
const client = require('twilio')(accountSid, authToken);

const getFormattedValidatedNumber = async (n) => {
  const response = await client.lookups.phoneNumbers(n).fetch({countryCode: 'US'})
  return response
}

export async function OfficeUpdateFormatPhones (data, {document, originalDocument}) {
  // if there are no changes to `phones`, do nothing
  if (_.isEqual(document.phones, originalDocument.phones)) {
    return data
  }
  if (document.phones && document.phones.length) {
    const fvnPhones = await Promise.all(
      document.phones.map(async phone => {
        const fvn = await getFormattedValidatedNumber(phone.phoneNumberAsInput)
        const fvnPhone = {
          phoneNumberAsInput: phone.phoneNumberAsInput,
          phoneNumberType: phone.phoneNumberType,
          phoneNumber: fvn.phoneNumber,
          nationalFormat: fvn.nationalFormat
        }
        return fvnPhone
      })
    )
    let updatedDocument = document
    updatedDocument.phones = fvnPhones
    return updatedDocument
  } else {
    return data
  }
}

export async function OfficeCreateFormatPhones (document) {
  if (document.phones && document.phones.length) {
    const fvnPhones = await Promise.all(
      document.phones.map(async phone => {
        const fvn = await getFormattedValidatedNumber(phone.phoneNumberAsInput)
        const fvnPhone = {
          phoneNumberAsInput: phone.phoneNumberAsInput,
          phoneNumberType: phone.phoneNumberType,
          phoneNumber: fvn.phoneNumber,
          nationalFormat: fvn.nationalFormat
        }
        return fvnPhone
      })
    )
    let updatedDocument = document
    updatedDocument.phones = fvnPhones
    return updatedDocument
  } else {
    return document
  }
}
