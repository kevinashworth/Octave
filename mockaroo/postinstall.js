var fs = require('fs')
var path = require('path')

var settingsFilePath = path.resolve(__dirname, '../settings.json')

var settings = {}

try {
  var settingsFile = fs.readFileSync(settingsFilePath)
  settings = JSON.parse(settingsFile)
} catch (err) {
  console.log(`Error reading ${settingsFilePath}: ${err}`)
}

if (settings.mockaroo) {
  if (settings.mockaroo.generateAndDownload) {
    settings.mockaroo = {
      generateAndDownload: false,
      seedDatabase: true,
      initializeAlgolia: true,
      updateAlgolia: true
    }
  }
  try {
    var data = JSON.stringify(settings, null, 2)
    fs.writeFileSync(settingsFilePath, data)
  } catch (err) {
    console.log(`Error writing ${settingsFilePath}: ${err}`)
  }
}
