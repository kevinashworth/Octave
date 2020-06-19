var fetch = require('node-fetch')
var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var error = chalk.bold.red
var success = chalk.bold.green

var key = encodeURIComponent('8631d820')
var project = encodeURIComponent('V8')

function generate (schema) {
  var url = 'https://api.mockaroo.com/api/generate.csv' +
    '?key=' + key +
    '&fields=' + encodeURIComponent(JSON.stringify(schema.columns))
  fetch(url, {
    method: 'post'
  }).then(res => {
    if (res.ok) {
      console.log(success(schema.name, 'generate success'))
      console.log('Mockaroo API response:')
      console.dir(res)
    } else {
      console.log(error('generate error:', res.statusText))
      console.dir(res)
    }
  })
}

function upload (datasetName, filePath) {
  var filename = encodeURIComponent(path.basename(filePath))
  fetch(`https://api.mockaroo.com/api/datasets/${encodeURIComponent(datasetName)}?key=8631d820&filename=${filename}&project=${project}`, {
    method: 'post',
    body: fs.readFileSync(filePath),
    headers: {
      'content-type': 'text/csv'
    }
  }).then(res => {
    if (res.ok) {
      console.log(success(datasetName, 'upload success'))
      console.log('Mockaroo API response:')
      console.dir(res)
    } else {
      console.log(error('upload error:', res.statusText))
    }
  })
}

function destroy (name, path) {
  fetch(`https://api.mockaroo.com/api/datasets/${encodeURIComponent(name)}?key=8631d820`, {
    method: 'delete'
  }).then(res => {
    if (res.ok) {
      console.log(success(res))
    } else {
      console.log(error('destroy error:', res.statusText))
    }
  })
}

module.exports = {
  destroy,
  generate,
  upload
}
