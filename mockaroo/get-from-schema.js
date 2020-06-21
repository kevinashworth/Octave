var Mockaroo = require('mockaroo')
var client = new Mockaroo.Client({ apiKey: '8631d820' })
var fs = require('fs')
var chalk = require('chalk')
var error = chalk.bold.red
var success = chalk.bold.green

var argv = require('yargs')
  .option('schema', {
    alias: 's',
    demand: true,
    description: 'Schema is contacts, offices, pastprojects, or projects'
  })
  .usage('Usage: $0 --schema=[schema.name]').argv
var schema = require('./schemas/' + argv.schema + '.schema.json')
var outFile = './generated/' + schema.name + '.js'

client.generate({
  count: schema.num_rows,
  format: schema.file_format,
  fields: schema.columns
}).then(function (records) {
  var outText = `/* eslint-disable quotes */
var ${schema.name} = ` +
    JSON.stringify(records, null, 2) + `
module.exports = { ${schema.name} }
`
  fs.writeFile(outFile, outText, function (err) {
    if (err) {
      return console.log(error('fs.writeFile error:', err))
    }
    console.log(success(schema.name, 'saved'))
  })
}).catch(function (error) {
  if (error instanceof Mockaroo.errors.InvalidApiKeyError) {
    console.log(error('invalid api key'))
  } else if (error instanceof Mockaroo.errors.UsageLimitExceededError) {
    console.log(error('usage limit exceeded'))
  } else if (error instanceof Mockaroo.errors.ApiError) {
    console.log(error('api error:', error.message))
  } else {
    console.log(error('unknown client.generate error:', error))
  }
})
