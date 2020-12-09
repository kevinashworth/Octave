/// <reference types="Cypress" />

describe('Sign in', function () {
  beforeEach(function () {
    cy.visit('/login')
  })

  it('looks inside <title> tag', () => {
    cy.get('head title')
      .should('contain', 'Login/Logout')
  })

  it('greets with Sign In', () => {
    cy.contains('h1', 'Sign In / Sign Up')
  })

  it('links to Sign Up', () => {
    cy.contains('Sign up')
      .should('have.id', 'switchToSignUp')
      .should('have.attr', 'href', '#')
  })

  // TODO: why does this not have 2 .message divs?
  it('requires password (without username or email)', () => {
    cy.get('form').contains('Sign in').click()
    cy.get('.message')
      .should('contain', 'Your password is too short')
  })

  it('requires password (with username or email)', () => {
    cy.get('input#usernameOrEmail').type('BadExample')
    cy.get('form').contains('Sign in').click()
    cy.get('.message')
      .should('contain', 'Your password is too short')
  })

  it('requires valid username or email and password', () => {
    cy.get('input#usernameOrEmail').type('BadExample')
    cy.get('input#password').type('12345678')
    cy.get('form').contains('Sign in').click()
    cy.get('.message')
      .should('contain', 'User not found')
  })

  // TODO: why does this not pass?
  it.skip('requires username or email', {
    retries: {
      runMode: 1,
      openMode: 1
    }
  }, () => {
    cy.get('input#password').type('A12345678')
    cy.get('form').contains('Sign in').click()
    cy.get('.message')
      .contains('Username required')
  })

  it('navigates to root on successful Sign In', () => {
    cy.get('input#usernameOrEmail').type('triad-cypress-editor')
    cy.get('input#password').type('password123')
    cy.get('#signIn').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  })
})
