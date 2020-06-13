/**
 * Load V8
 */

// const path = require('path');

module.exports = function loader (source) {
  // const result = path.resolve(__dirname, '../../packages/v8-alba/lib/client/main.js');
  // // const result = path.resolve(__dirname, '../../packages/v8-alba/lib/components/offices/OfficeMini.jsx');
  // console.log('v8-loader result:', result)
  // return result;
  //
  const result = source.replace(
    /v8-alba/,
    '/Users/kevin/Developer/bitbucket_projects/V8-Alba/packages/v8-alba/lib/client/main.js'
  )
  return result
}
