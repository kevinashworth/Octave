/**
 * Load Octave
 */
// const { getOptions } = require('loader-utils')

// module.exports = function loader (source) {
//   const options = getOptions(this)
//   const { packagesDir, environment } = options
//   return `${packagesDir}/octave/lib/${environment}/main.js`
// }

// const { getOptions } = require('loader-utils')
// module.exports = function loader (source) {
//   const options = getOptions(this)

//   const { packagesDir, environment = 'client' } = options
//   // prefixing your packages name makes it easier to write a loader
//   const prefix = `${packagesDir}/octave`
//   const defaultPath = `/lib/${environment}/main.js`

//   const result = source.replace(
//     /meteor\/example-(.*?(?=\/|'|"))(.*?(?=\'|\"))/g, // match Meteor packages that are lfg packages, + the import path (without the quotes)
//     (match, packageName, importPath) => {
//       console.log('Found Starter example package', packageName)
//       if (importPath) {
//         return `${prefix}${packageName}${importPath}`
//       }
//       return `${prefix}${packageName}${defaultPath}`
//     }
//   )
//   return result
// }

module.exports = function loader (source) {
  return '../packages/octave/lib/modules/components.js'
  // return `../packages/octave/lib/client/main.js`
}
