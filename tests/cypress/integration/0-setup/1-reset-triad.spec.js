/// <reference types="cypress" />

describe('Before other tests', () => {
  it('reset Triad', () => {
    cy.resetTriad()
    cy.log('ready')
  })
})
