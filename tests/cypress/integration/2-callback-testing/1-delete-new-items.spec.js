/// <reference types="cypress" />

/*
 * Delete any new items.
 *
 * Reminder: Use keyword `function`, not arrow function, to access `this.items.foo`
 */

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Delete Created Items', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    // cy.resetTriad()
    cy.stubAlgolia()
    cy.login()
  })

  beforeEach(() => {
    cy.fixture('callback-testing.json').as('items')
    Cypress.Cookies.preserveOnce('meteor_login_token')
  })

  it('delete test items found in database', function () {
    const { contact, office, project, pastproject } = this.items
    cy.visit('/projects')
    cy.get('div.card-body > table > tbody > tr > td > a')
      .contains(project.projectTitle).click()
    cy.get('h2 > div > a').contains('Edit').click({ force: true })
    cy.get('.delete-link').click()

    cy.visit('/pastprojects')
    cy.get('div.card-body > table > tbody > tr > td > a')
      .contains(pastproject.projectTitle).click()
    cy.get('h2 > div > a').contains('Edit').click({ force: true })
    cy.get('.delete-link').click()

    cy.visit('/contacts')
    cy.get('div.card-body > table > tbody > tr > td > a')
      .contains(contact.lastName).click()
    cy.get('h2 > div > a').contains('Edit').click({ force: true })
    cy.get('.delete-link').click()

    cy.visit('/offices')
    cy.get('div.card-body > table > tbody > tr > td > a')
      .contains(office.displayName).click()
    cy.get('h2 > div > a').contains('Edit').click({ force: true })
    cy.get('.delete-link').click()
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
