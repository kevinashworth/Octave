/// <reference types="cypress" />

describe('Before other tests', () => {
  it('download Triad', () => {
    cy.downloadTriad()
    cy.log('ready')
  })
})
