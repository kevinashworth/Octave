/// <reference types="Cypress" />

// TODO:
// use network layer of Cypress to test that data from server is displayed correctly:
// number of results after a CRUD operation
// titles, names, dates
// links to individual pages
// what loading indicator looks like when results are 'in flight'
// what happens when server returns no results or is down

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Latest Updates', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.login()
    cy.visit('/latest')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
  })

  it('begins with `Newest Projects Casting`', () => {
    cy.contains('.card-title.h5', 'Newest Projects Casting')
  })

  it('contains the correct number of cards (6, 12, 6, 6, 6) (5 groups)', () => {
    cy.get('.card').should('have.length', 6 + 12 + 6 + 6 + 6 + 5)
  })

  it('first card in each group links to singles', () => {
    cy.get('.card-accent-contacts a').first()
      .should('have.attr', 'href')
      .and('include', 'contacts')
    cy.get('.card-accent-offices a').first()
      .should('have.attr', 'href')
      .and('include', 'offices')
    cy.get('.card-accent-pastprojects a').first()
      .should('have.attr', 'href')
      .and('include', 'past-projects')
    cy.get('.card-accent-projects a').first()
      .should('have.attr', 'href')
      .and('include', 'projects')
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
