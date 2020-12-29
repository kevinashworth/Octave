/// <reference types="cypress" />

/**
 * Update Projects to test packages/octave/lib/server/projects/callbacks
 *
 * Reminder: Use keyword `function`, not arrow function, to access `this.items.foo`
 */

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Projects Delete', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.readyForCypress()
    cy.resetTriad()
    cy.login()
    cy.getTestingCollection('contacts')
    cy.getTestingCollection('offices')
    cy.getTestingCollection('projects')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
    cy.fixture('output/callback-testing/testing-contacts.json').as('testingContacts')
    cy.fixture('output/callback-testing/testing-offices.json').as('testingOffices')
    cy.fixture('output/callback-testing/testing-projects.json').as('testingProjects')
  })

  it('delete a project', {
    retries: {
      runMode: 0,
      openMode: 0
    }
  }, function () {
    const project = Cypress._.find(this.testingProjects, { projectTitle: 'THAILAND' })
    const contact0 = Cypress._.find(this.testingContacts, { displayName: 'SHANE SAVINS' })
    const contact1 = Cypress._.find(this.testingContacts, { displayName: 'QUINN QUICK' })
    const office = Cypress._.find(this.testingOffices, { displayName: 'KAZIO CASTING' })
    const log = Cypress.log({
      name: 'delete',
      displayName: 'DELETE PROJECT',
      message: 'Delete a project, assert results of delete callbacks',
      autoEnd: false
    })

    // verify all 4 items (and Algolia) before
    cy.goTo('projects', project)
    cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
    cy.get('[data-cy=contact-link]').should('have.length', 2)
    cy.get('[data-cy=contact-link]').first().should('contain', contact0.displayName)
    cy.get('[data-cy=contact-link]').first().click()
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact0.displayName)
    cy.get('[data-cy=project-link]').should('have.length', 2)
    cy.get('[data-cy=project-link]').first().should('contain', project.projectTitle)
    cy.go('back')
    cy.get('[data-cy=contact-link]').last().should('contain', contact1.displayName)
    cy.get('[data-cy=contact-link]').last().click()
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact1.displayName)
    cy.get('[data-cy=project-link]').should('have.length', 2)
    cy.get('[data-cy=project-link]').first().should('contain', project.projectTitle)
    cy.go('back')
    cy.get('[data-cy=office-link]').should('have.length', 1)
    cy.get('[data-cy=office-link]').should('contain', office.displayName)
    cy.get('[data-cy=office-link]').click()
    cy.get('[data-cy=office-header]', { log: false }).contains(office.displayName)
    cy.get('[data-cy=project-link]').should('have.length', 2)
    cy.get('[data-cy=project-link]').last().should('contain', project.projectTitle)
    cy.go('back')
    cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
    cy.toggleSidebar()
    cy.enterAlgoliaSearch(project.projectTitle)
    cy.percySnapshot('Algolia Search Results')
    cy.get('[data-cy=search-result]').should('have.length', 1)

    // delete the project
    cy.edit()
    cy.delete()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/projects/')
    })

    // verify project removed from contacts, office (and Algolia)
    cy.goTo('contacts', contact0)
    cy.get('[data-cy=project-link]').should('have.length', 1)
    cy.goTo('contacts', contact1)
    cy.get('[data-cy=project-link]').should('have.length', 1)
    cy.goTo('offices', office)
    cy.get('[data-cy=project-link]').should('have.length', 1)
    cy.reload(true)
    cy.toggleSidebar()
    cy.enterAlgoliaSearch(project.projectTitle)
    cy.get('[data-cy=search-result]').should('not.exist')

    cy.log('you must now "Create Algolia Record" for THAILAND manually')
    cy.exec('open https://triad.the-4th-wall.com/projects/G6rCb36z5yhQhoHLB/thailand')

    log.end()
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
