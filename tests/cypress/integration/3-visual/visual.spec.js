/// <reference types="cypress" />

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

context('Octave Visual Testing', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.resetTriad()
    cy.stubAlgolia()
    cy.login()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
    cy.visit('/')
  })

  it('Loads the app', function () {
    cy.visit('latest')
    cy.get('.app').should('exist')
    cy.contains('.card-title.h5', 'Newest Projects Casting')
    cy.get('.card-accent-projects').should('have.length', 18)
    cy.percySnapshot()
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
