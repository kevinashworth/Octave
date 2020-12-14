/// <reference types="cypress" />

// TODO:
// verify displayed content matches the fetched data: notes, address, offices, links, projects, past proejcts
// comments -- listing, creating, deleting
// history (patches)
// correct links to individual pages for offices, [past] projects
// correct links for external links
// what loading indicator looks like when results are 'in flight'
// what happens when server returns no results or is down

const findOne = 'mongo --quiet mongodb://127.0.0.1:4005/meteor --eval ' +
  "'db.contacts.findOne({}, {updatedAt:0, createdAt:0})' " +
  '> tests/cypress/fixtures/contact.json'

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Contact Single', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.resetTriad()
    cy.stubAlgolia()
    cy.login()
    cy.exec(findOne)
      .its('code').should('eq', 0)
    cy.visit('/')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
    cy.fixture('contact.json').as('contact')
  })

  // NB: keyword `function` not arrow function to access `this.contact`
  it('should display contact name in header', function () {
    const contact = this.contact
    cy.visit(`/contacts/${contact._id}`)
    cy.get('h2.card-header').contains(contact.displayName)
  })

  it('should display contact title', function () {
    const contact = this.contact
    cy.visit(`/contacts/${contact._id}`)
    cy.get('div.card-text > :nth-child(2)').contains(contact.title)
  })

  it('should display office name', function () {
    const contact = this.contact
    cy.visit(`/contacts/${contact._id}`)
    if (contact.offices) {
      cy.get('.card-accent-offices >.card-header > a').should('have.text', contact.offices[0].officeName)
    }
  })

  it('should have a working edit button', function () {
    const contact = this.contact
    cy.visit(`/contacts/${contact._id}`)
    cy.get('h2.card-header .float-right > .btn').should('have.text', 'Edit')
    cy.get('h2.card-header .float-right > .btn').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/contacts/${contact._id}/edit`)
      .then(() => {
        cy.get('a.form-cancel').click()
      })
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
