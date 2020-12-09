/// <reference types="cypress" />

/*
 * Update new items to invoke and test Vulcan callbacks.
 *
 * Reminder: Use keyword `function`, not arrow function, to access `this.items.foo`
 */

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Create New Items', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.login()
  })

  beforeEach(() => {
    cy.fixture('callback-testing.json').as('items')
    Cypress.Cookies.preserveOnce('meteor_login_token')
  })

  it.skip('update something...', function () {
    const { contact, office, project, pastproject } = this.items
    cy.visit('/projects')
    cy.get('div.card-body > table > tbody > tr > td > a')
      .contains(project.projectTitle).click()
    cy.get('h2 > div > a').contains('Edit').click({ force: true })
    cy.get('.form-section-contacts').within(() => {
      cy.log('Do something with contacts')
    })

    cy.visit('/pastprojects')
    cy.get('div.card-body > table > tbody > tr > td > a')
      .contains(pastproject.projectTitle).click()
    cy.get('h2 > div > a').contains('Edit').click({ force: true })
    cy.get('.form-section-contacts').within(() => {
      cy.log('Do something with contacts')
    })

    cy.visit('/contacts')
    cy.get('div.card-body > table > tbody > tr > td > a')
      .contains(contact.lastName).click()
    cy.get('h2 > div > a').contains('Edit').click({ force: true })
    cy.get('.form-section-projects').within(() => {
      cy.log('Do something with projects')
    })

    cy.visit('/offices')
    cy.get('div.card-body > table > tbody > tr > td > a')
      .contains(office.displayName).click()
    cy.get('h2 > div > a').contains('Edit').click({ force: true })
    cy.get('.form-section-projects').within(() => {
      cy.log('Do something with projects')
    })
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
