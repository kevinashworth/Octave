const accountSid = '***REMOVED***';
const authToken = '***REMOVED***';
const client = require('twilio')(accountSid, authToken);

const getFormattedValidatedNumber = async (n) => {
  const response = await client.lookups.phoneNumbers(n).fetch({countryCode: 'US'})
  return response
}

export function OfficeEditFormatPhones (document, properties) {
  if (document.phones && document.phones.length) {
    const newPhones = document.phones.map(phone => {
      const v = getFormattedValidatedNumber(phone.phoneNumber)
      const newPhone = {
        phoneNumber: v,
        numberType: phone.numberType
      }
      console.log('[KA] newPhone:', newPhone)
      return newPhone
    })
    console.log('[KA] newPhones:', newPhones)
    document.phones = newPhones
    return document
  } else {
    return document
  }
}

// const list = [1, 2, 3, 4, 5] //...an array filled with values
//
// const functionWithPromise = item => { //a function that returns a promise
//   return Promise.resolve('ok')
// }
//
// const anAsyncFunction = async item => {
//   return functionWithPromise(item)
// }
//
// const getData = async () => {
//   return Promise.all(list.map(item => anAsyncFunction(item)))
// }
//
// getData().then(data => {
//   console.log(data)
// })
