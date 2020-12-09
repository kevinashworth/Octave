// Run this file after downloading from Mockaroo
// Provides an `_id` that fits the Meteor formula
const path = require('path')
const randomstring = require('randomstring')
const replace = require('replace-in-file')
const chalk = require('chalk')
const error = chalk.bold.red
// const success = chalk.bold.green

const argv = require('yargs')
  .option('schema', {
    alias: 's',
    demand: true,
    description: 'Schema is "contacts", "offices", "pastprojects", or "projects"'
  })
  .usage('Usage: $0 --schema=schema_name').argv

const schema = argv.schema

const meteorId = () => {
  const UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz'
  return randomstring.generate({
    length: 17,
    charset: UNMISTAKABLE_CHARS
  })
}

const generatedPath = path.join(__dirname, 'generated')

const options = {
  files: path.resolve(generatedPath, schema + '.js'),
  from: /abcdefghijklmnopq/g,
  to: () => meteorId()
}

try {
  const results = replace.sync(options)
  console.log(`${schema} replace-in-file results:`)
  console.log(results)
} catch (err) {
  console.log(error('replace-in-file error:'))
  console.log(err)
}
