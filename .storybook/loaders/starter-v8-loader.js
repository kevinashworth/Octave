/**
 * Load the local packages
 */
const { getOptions } = require('loader-utils')

module.exports = function loader (source) {
  const options = getOptions(this)

  const { packagesDir, environment = 'client' } = options
  const prefix = `${packagesDir}/v8-`
  const defaultPath = `/lib/${environment}/main.js`

  const result = source.replace(
    /v8-(.*?(?=\/|'|"))(.*?(?='|"))/g,
    (match, packageName, importPath) => {
      console.log('[KA] starter-v8-loader // Found Starter v8 package', packageName)
      if (importPath) {
        return `${prefix}${packageName}${importPath}`
      }
      return `${prefix}${packageName}${defaultPath}`
    }
  )

  return result
}

// This regex will match:
// meteor/v8-{packageName}{some-optional-import-path}
//
// Example:
// meteor/v8-forum => match, packageName="forum"
// meteor/v8-forum/foobar.js => match, packageName="forum", importPath="/foobar.js"
// meteor/another-package => do not match
//
// Explanation:
// .+?(?=something) matches every char until "something" is met, excluding something
// we use it to match the package name, until we meet a ' or "

// match Meteor packages that are lfg packages, + the import path (without the quotes)
