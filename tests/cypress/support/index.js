// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'
import './smartform'

import '@percy/cypress'
require('cypress-plugin-tab')

// See https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/fundamentals__errors/cypress/integration/test-fails.js
// See https://docs.cypress.io/api/events/catalog-of-events.html#Uncaught-Exceptions

Cypress.on('uncaught:exception', (e, runnable) => {
  // return false
  console.log('error:', e)
  console.log('runnable:', runnable)
  // we expected this error, so let's ignore it and let the test continue
  if (e.name === 'TypeError' && e.message.includes('Cannot read property')) {
    return false
  }
  // on any other error message the test fails
})
