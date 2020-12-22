/// <reference types="Cypress" />

Cypress.Commands.add('login', () => {
  const user = 'triad-cypress-editor'
  const pass = 'password123'
  const log = Cypress.log({
    name: 'login',
    displayName: 'LOGIN',
    message: [`Logging in ${user}`],
    autoEnd: false
  })
  cy.visit('/login', { log: false })
  cy.get('input#usernameOrEmail', { log: false }).type(user, { log: false })
  cy.get('input#password', { log: false }).type(pass, { log: false })
  cy.get('#signIn', { log: false }).click({ log: false })
  cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  log.end()
})

Cypress.Commands.add('downloadTriad', () => {
  const log = Cypress.log({
    name: 'downloadTriad',
    displayName: 'DOWNLOAD TRIAD',
    message: ['Downloading Triad.gz'],
    autoEnd: false
  })
  cy.exec(
    'mongodump --uri mongodb+srv://triad-read-only:d0wnl0adTr1ad@cluster0.dk7n0.mongodb.net ' +
    '--archive=./tests/cypress/fixtures/Triad.gz --gzip --db=Triad',
    { timeout: 60000 }
  )
  log.end()
})

Cypress.Commands.add('resetTriad', () => {
  const log = Cypress.log({
    name: 'resetTriad',
    displayName: 'RESET TRIAD',
    message: ['Restoring Triad.gz'],
    autoEnd: false
  })
  cy.exec(
    'mongorestore --host localhost:4005 --drop --gzip ' +
    '--archive=./tests/cypress/fixtures/Triad.gz ' +
    '--nsInclude="Triad.*" --nsFrom="Triad.*" --nsTo="meteor.*"',
    { timeout: 90000 }
  )
  log.end()
})

Cypress.Commands.add('getTestingCollection', (collectionName) => {
  const log = Cypress.log({
    name: 'getTestingCollection',
    displayName: 'GET TRIAD',
    message: [`Getting ${collectionName} from Triad.gz`],
    autoEnd: false
  })
  const userId = 'yhaNiNHL4vKEytrCn'
  cy.exec(
    'mongo --quiet localhost:4005/meteor --eval ' +
    `'db.${collectionName}.find({ userId: { $eq: "${userId}"} }, { updatedAt: 0, createdAt: 0 }).map(o => o)' ` +
    `> tests/cypress/fixtures/output/callback-testing/testing-${collectionName}.json`,
    { log: false }
  ).its('code', { log: false }).should('eq', 0)
  log.end()
})

// use expectInnerText for bolded last name or for react-select
Cypress.Commands.add('expectInnerText', (element, text) => {
  cy.get(element).should(($div) => {
    expect($div.get(0).innerText).to.eq(text)
  })
})

Cypress.Commands.add('goTo', (collectionName, item) => {
  Cypress.log({
    name: 'go to',
    displayName: 'GO TO',
    message: [`/${collectionName}/${item._id}`]
  })
  const url = `/${collectionName}/${item._id}/${item.slug}`
  cy.visit(url, { log: false })
})

// 2020-11-29: intercept is a little buggy, so leave it for now
// cy.intercept({ url: /^https:\/\/14rup1ok0b-(dsn|2)\.algolia(net\.com|\.net)\/1\/indexes/ }, staticResponse)
Cypress.Commands.add('stubAlgolia', () => {
  const staticResponse = {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': window.location.origin,
      'Access-Control-Allow-Credentials': 'true'
    },
    body: {
      results: []
    }
  }
  cy.intercept({ url: 'algolia' }, staticResponse)
})

Cypress.Commands.add('showPastProjects', () => {
  cy.get('[data-cy=show-hide-past-projects]').click({ log: false })
})

Cypress.Commands.add('toggleSidebar', () => {
  cy.get('[data-cy=sidebar-toggler]').filter(':visible').click()
})

Cypress.Commands.add('enterAlgoliaSearch', (search) => {
  cy.get('[data-cy=search-input]').type(search)
})

// see https://github.com/cypress-io/cypress/issues/3942#issuecomment-485648100
// Cypress.Commands.add('dragAndDrop', ({ subject, target, section = 'body' }) => {
//   Cypress.log({
//     name: 'DRAGNDROP',
//     message: `Dragging element ${subject} to ${target}`,
//     consoleProps: () => {
//       return {
//         subject: subject,
//         target: target
//       }
//     }
//   })
//   const BUTTON_INDEX = 0
//   const SLOPPY_CLICK_THRESHOLD = 10
//   cy.get(target)
//     .first()
//     .then($target => {
//       const coordsDrop = $target[0].getBoundingClientRect()
//       cy.get(subject)
//         .first()
//         .then(subject => {
//           const coordsDrag = subject[0].getBoundingClientRect()
//           cy.wrap(subject)
//             .trigger('mousedown', {
//               button: BUTTON_INDEX,
//               clientX: coordsDrag.x,
//               clientY: coordsDrag.y,
//               force: true
//             })
//             .trigger('mousemove', {
//               button: BUTTON_INDEX,
//               clientX: coordsDrag.x + SLOPPY_CLICK_THRESHOLD,
//               clientY: coordsDrag.y,
//               force: true
//             })
//           cy.get(section)
//             .trigger('mousemove', {
//               button: BUTTON_INDEX,
//               clientX: coordsDrop.x,
//               clientY: coordsDrop.y,
//               force: true
//             })
//             .trigger('mouseup')
//         })
//     })
// })
