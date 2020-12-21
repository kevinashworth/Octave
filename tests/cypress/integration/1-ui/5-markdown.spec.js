/// <reference types="cypress" />

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Markdown', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.resetTriad()
    cy.stubAlgolia()
    cy.login()
    cy.visit('/')
    cy.getTestingCollection('projects')
    cy.getTestingCollection('pastprojects')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
    cy.fixture('output/callback-testing/testing-projects.json').as('testingProjects')
    cy.fixture('output/callback-testing/testing-pastprojects.json').as('testingPastprojects')
  })

  it('verify autolinks in markdown', function () {
    const pastproject = Cypress._.find(this.testingPastprojects, { projectTitle: 'BLACKGIRDLE BULRUSH' })
    const project = Cypress._.find(this.testingProjects, { projectTitle: 'CANADA' })
    const log = Cypress.log({
      name: 'markdown links',
      displayName: 'MARKDOWN',
      message: 'Assure ReactMarkdown/gfm on links and emails.',
      autoEnd: false
    })

    cy.goTo('pastprojects', pastproject)
    cy.get('[data-cy=pastproject-header]', { log: false }).contains(pastproject.projectTitle)
    cy.window().then(w => w.beforeReload = true)

    // assert prepared links in "Production Notes:"
    cy.get('#past_projects_single_tabs-tabpane-main').within(() => {
      cy.get('a').should('have.length', 4)
      cy.get('[target=notelinks]')
        .should('have.length', 2)
        .should('contain', 'example.com')
      cy.get('[href^=mailto]')
        .should('have.length', 1)
        .should('contain', 'contact@example.com')
    })

    // assert link to project CANADA is React Router Link
    cy.window().should('have.prop', 'beforeReload', true)
    cy.get(`[href$=${project.slug}]`).click()
    cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
    cy.window().should('have.prop', 'beforeReload', true)

    cy.go('back')
    log.end()
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
