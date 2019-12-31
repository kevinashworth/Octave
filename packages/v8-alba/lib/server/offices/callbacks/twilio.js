import _ from 'lodash'

const accountSid = '***REMOVED***';
const authToken = '***REMOVED***';
const client = require('twilio')(accountSid, authToken);

const getFormattedValidatedNumber = async (n) => {
  const response = await client.lookups.phoneNumbers(n).fetch({countryCode: 'US'})
  return response
}

export async function OfficeUpdateFormatPhones (data, {document, originalDocument}) {
  console.log('[KA] document.phones:', document.phones)
  console.log('[KA] originalDocument.phones:', originalDocument.phones)
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
        console.log('[OfficeUpdateFormatPhones] fvnPhone:', fvnPhone)
        return fvnPhone
      })
    )
    console.log('[OfficeUpdateFormatPhones] fvnPhones:', fvnPhones)
    // eslint-disable-next-line require-atomic-updates
    document.phones = fvnPhones
    return document
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
        console.log('[OfficeCreateFormatPhones] fvnPhone from Twilio:', fvnPhone)
        return fvnPhone
      })
    )
    console.log('[OfficeCreateFormatPhones] fvnPhones:', fvnPhones)
    // eslint-disable-next-line require-atomic-updates
    document.phones = fvnPhones
    return document
  } else {
    return document
  }
}

// export const someFunction = (document) => {
//   const promises = document.phones.map(async (phone) => {
//     console.log('[KA] document.phones.map(async):', phone)
//     return {
//       numberType: phone.numberType,
//       myValue: await client.lookups.phoneNumbers(phone.phoneNumber).fetch({countryCode: 'US'})
//     }
//   });
//   // const thePromises = Promise.all(promises);
//   // console.log('[KA] thePromises:', thePromises)
//   return Promise.all(promises);
// }
//
// let characterResponse = await fetch('http://swapi.co/api/people/2/')
// let characterResponseJson = await characterResponse.json()
// let films = await Promise.all(
//   characterResponseJson.films.map(async filmUrl => {
//     let filmResponse = await fetch(filmUrl)
//     return filmResponse.json()
//   })
// )
// console.log(films)

// const list = document.phones //...an array filled with values
//
// const functionWithPromise = n => { //a function that returns a promise
//   return client.lookups.phoneNumbers(n).fetch({countryCode: 'US'})
// }
//
// const anAsyncFunction = async item => {
//   return functionWithPromise(item)
// }
//
// const getData = async () => {
//   return Promise.all(list.map(phone => anAsyncFunction(phone.phoneNumber)))
// }
//
// getData().then(data => {
//   console.log(data)
// })
//
//
