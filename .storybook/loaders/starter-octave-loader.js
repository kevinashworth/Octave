/**
 * Load the local packages
 */
const { getOptions } = require('loader-utils')

module.exports = function loader (source) {
  const options = getOptions(this)

  const { packagesDir, environment = 'client' } = options
  const prefix = `${packagesDir}/octave-`
  const defaultPath = `/lib/${environment}/main.js`

  const result = source.replace(
    /octave-(.*?(?=\/|'|"))(.*?(?='|"))/g,
    (match, packageName, importPath) => {
      console.log('[KA] starter-octave-loader // Found Starter octave package', packageName)
      if (importPath) {
        return `${prefix}${packageName}${importPath}`
      }
      return `${prefix}${packageName}${defaultPath}`
    }
  )

  return result
}

// This regex will match:
// meteor/octave-{packageName}{some-optional-import-path}
//
// Example:
// meteor/octave-forum => match, packageName="forum"
// meteor/octave-forum/foobar.js => match, packageName="forum", importPath="/foobar.js"
// meteor/another-package => do not match
//
// Explanation:
// .+?(?=something) matches every char until "something" is met, excluding something
// we use it to match the package name, until we meet a ' or "

// match Meteor packages that are lfg packages, + the import path (without the quotes)
