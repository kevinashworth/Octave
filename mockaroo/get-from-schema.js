var Mockaroo = require('mockaroo')
var client = new Mockaroo.Client({ apiKey: '8631d820' })
var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var error = chalk.bold.red
var success = chalk.bold.green

var argv = require('yargs')
  .option('schema', {
    alias: 's',
    demand: true,
    description: 'Schema is "contacts", "offices", "pastprojects", or "projects"'
  })
  .usage('Usage: $0 --schema=schema_name').argv
var schema = require(path.resolve(__dirname, './schemas/' + argv.schema + '.schema.json'))

var generatedPath = path.join(__dirname, 'generated')
fs.mkdir(generatedPath, { recursive: true }, (err) => {
  if (err) throw err
})
var outFile = path.resolve(generatedPath, schema.name + '.js')

client
  .generate({
    count: schema.num_rows,
    format: schema.file_format,
    fields: schema.columns
  })
  .then(function (records) {
    var outText =
      '/* eslint-disable quotes */\n' +
      `var ${schema.name} = ` +
      JSON.stringify(records, null, 2) +
      `\nmodule.exports = { ${schema.name} }\n`
    fs.writeFile(outFile, outText, function (err) {
      if (err) {
        console.log(error('fs.writeFile error:'))
        console.log(err)
      }
      console.log(success(schema.name, `${schema.name} saved (${schema.num_rows})`))
    })
  })
  .catch(function (err) {
    if (err instanceof Mockaroo.errors.InvalidApiKeyError) {
      console.log(error('invalid api key'))
    } else if (err instanceof Mockaroo.errors.UsageLimitExceededError) {
      console.log(error('usage limit exceeded'))
    } else if (err instanceof Mockaroo.errors.ApiError) {
      console.log(error('api error:'))
      console.log(err.message)
    } else {
      console.log(error('unknown client.generate error:'))
      console.log(err)
    }
  })
