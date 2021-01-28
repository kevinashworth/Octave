/* After getting Mockaroo data, rewrite settings.json accordingly */

const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const isEqual = require('lodash.isequal')

const settingsFilePath = path.resolve(__dirname, '../settings.json')

let settings = {}

const result = {
  generateAndDownload: false,
  seedDatabase: true,
  initializeAlgolia: true,
  updateAlgolia: true
}

try {
  const settingsFile = fs.readFileSync(settingsFilePath)
  settings = JSON.parse(settingsFile)
} catch (err) {
  console.log(chalk.red(`Error reading ${settingsFilePath}:`))
  console.log(err)
}

if (!isEqual(settings.mockaroo, result)) {
  console.log(chalk.yellow('In settings.json, mockaroo was this:'))
  console.log(JSON.stringify(settings.mockaroo, null, 2))
  try {
    settings.mockaroo = result
    const data = JSON.stringify(settings, null, 2)
    fs.writeFileSync(settingsFilePath, data)
    console.log(chalk.green('In settings.json, mockaroo is now this:'))
    console.log(JSON.stringify(settings.mockaroo, null, 2))
  } catch (err) {
    console.log(chalk.red(`Error writing ${settingsFilePath}:`))
    console.log(err)
  }
}
