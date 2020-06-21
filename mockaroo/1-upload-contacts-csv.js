var fetch = require('node-fetch')
var Papa = require('papaparse')
var chalk = require('chalk')
var error = chalk.bold.red
var success = chalk.bold.green

var key = encodeURIComponent('8631d820')
var project = encodeURIComponent('V8')
var datasetName = 'contacts'
var name = encodeURIComponent(datasetName)

var generated = require('./generated/contacts.js')
var minContacts = generated.contacts.map(contact => {
  const { _id, displayName, title } = contact
  return {
    _id,
    displayName,
    title
  }
})
console.log(minContacts)
var csv = Papa.unparse(minContacts)

fetch(`https://api.mockaroo.com/api/datasets/${name}?filename=${name}.csv&key=${key}&project=${project}`, {
  method: 'post',
  body: csv,
  headers: {
    'content-type': 'text/csv'
  }
}).then(res => {
  if (res.ok) {
    console.log(success(datasetName, 'upload success'))
    // console.log('Mockaroo API response:')
    // console.dir(res)
  } else {
    console.log(error('upload error:', res.statusText))
  }
})
