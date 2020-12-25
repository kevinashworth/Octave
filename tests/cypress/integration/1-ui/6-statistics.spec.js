/// <reference types="cypress" />

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Statistics', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.downloadTriad()
    cy.resetTriad()
    cy.stubAlgolia()
    cy.login()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
  })

  it('verify Write These Statistics', function () {
    const log = Cypress.log({
      name: 'statistics',
      displayName: 'WRITE STATISTICS',
      message: 'Write statistics 115 --> 117',
      autoEnd: false
    })
    let beforeStat = 0

    // before, there are 115 features casting
    cy.visit('/trends')
    cy.get('[data-cy=features-casting]').then(($span) => {
      beforeStat = parseInt($span.text())
      cy.log('features stat before', beforeStat)
    })
    cy.percySnapshot()

    // write the statistics
    cy.visit('/statistics/list')
    cy.get('[data-cy=write-statistics]').click()
    cy.get('.flash-messages').should(($div) => {
      expect($div.get(0).innerText).to.contain('Statistics updated as of')
    })
    cy.percySnapshot()

    // after, there are 117 features casting
    cy.visit('/trends')
    cy.get('[data-cy=features-casting]').then(($span) => {
      const stat = parseInt($span.text())
      cy.log('features stat after', stat)
      expect(stat - beforeStat).to.eq(2)
    })

    log.end()
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
