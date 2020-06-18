const csv = require('csvtojson')
var fs = require('fs')
var chalk = require('chalk')
var error = chalk.bold.red
var success = chalk.bold.green

function csvtojson (collectionFilename, csvFilePath) {
  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      fs.writeFile(collectionFilename, jsonObj, function (err) {
        if (err) {
          return console.log(error('fs.writeFile error:', err))
        }
        console.log(success(collectionFilename, 'saved'))
      })
    })
}

csvtojson('contacts.json', './generated/contacts.csv')

// module.exports = {
//   csvtojson
// }
