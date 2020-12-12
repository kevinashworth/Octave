/// <reference types="cypress" />

/**
 * Create Offices to test packages/octave/lib/server/offices/callbacks
 *
 */

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Create Office', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.resetTriad()
    cy.stubAlgolia()
    cy.login()
    cy.getTestingCollection('contacts')
    // cy.getTestingCollection('offices')
    cy.getTestingCollection('projects')
    cy.getTestingCollection('pastprojects')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
    cy.fixture('output/callback-testing/testing-contacts.json').as('testingContacts')
    // cy.fixture('output/callback-testing/testing-offices.json').as('testingOffices')
    cy.fixture('output/callback-testing/testing-projects.json').as('testingProjects')
    cy.fixture('output/callback-testing/testing-pastprojects.json').as('testingPastprojects')
    cy.fixture('callback-testing.json').as('items')
  })

  it('create office with 2 contacts, 2 projects, and 2 past projects', function () {
    const { office } = this.items
    const contact0 = Cypress._.find(this.testingContacts, { lastName: 'MOSTEL' })
    const contact1 = Cypress._.find(this.testingContacts, { lastName: 'KYNASTONE' })
    const project0 = Cypress._.find(this.testingProjects, { projectTitle: 'BRAZIL' })
    const project1 = Cypress._.find(this.testingProjects, { projectTitle: 'ARGENTINA' })
    const pastproject0 = Cypress._.find(this.testingPastprojects, { projectTitle: 'ROSE MEADOWSWEET' })
    const pastproject1 = Cypress._.find(this.testingPastprojects, { projectTitle: 'BLACKGIRDLE BULRUSH' })
    const log = Cypress.log({
      name: 'create office',
      displayName: 'CREATE AN OFFICE',
      message: ['Creating an office with 2 contacts and 2 [past]projects.'],
      autoEnd: false
    })

    // create
    cy.visit('/offices/new')
    cy.get('#displayName').type(office.displayName)
    cy.get('#body').type(office.body)
    cy.get('.form-section-contacts').within(() => {
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.waitForContactOptions()
      cy.selectContactAndTitle(contact0.displayName, contact0.title, 0)
      cy.selectContactAndTitle(contact1.displayName, contact1.title, 1)
    })
    cy.get('.form-section-projects').within(() => {
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.waitForProjectOptions2()
      cy.mySelect('projectId', project0.projectTitle, 0)
      cy.mySelect('projectId', project1.projectTitle, 1)
    })
    cy.get('.form-section-pastProjects').click().within(() => {
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.waitForPastProjectOptions2()
      cy.mySelect('projectId', pastproject0.projectTitle, 0)
      cy.mySelect('projectId', pastproject1.projectTitle, 1)
    })
    cy.submit()
    cy.location().then((loc) => {
      cy.writeFile('temp-office-link.txt', loc.pathname)
      cy.log(`created office at ${loc.pathname}`)
    })

    // verify all 7 items after create
    cy.get('[data-cy=office-header]', { log: false }).contains(office.displayName)
    cy.get('[data-cy=contact-link]').should('have.length', 2)
    cy.get('[data-cy=contact-link]').first().then((link) => cy.expectInnerText(link, contact0.displayName))
    cy.get('[data-cy=contact-link]').last().then((link) => cy.expectInnerText(link, contact1.displayName))
    cy.get('[data-cy=project-link]').should('have.length', 2)
    cy.get('[data-cy=project-link]').first().should('contain', project0.projectTitle)
    cy.get('[data-cy=project-link]').last().should('contain', project1.projectTitle)
    cy.get('[data-cy=show-hide-past-projects]').click({ log: false })
    cy.get('[data-cy=pastproject-link]').should('have.length', 2)
    cy.get('[data-cy=pastproject-link]').first().should('contain', pastproject1.projectTitle) // sorting gotcha!
    cy.get('[data-cy=pastproject-link]').last().should('contain', pastproject0.projectTitle)
    cy.percySnapshot()

    cy.goTo('contacts', contact0)
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact0.displayName)
    cy.get('[data-cy=office-link]').should('contain', office.displayName)
    cy.goTo('contacts', contact1)
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact1.displayName)
    cy.get('[data-cy=office-link]').should('contain', office.displayName)
    cy.goTo('projects', project0)
    cy.get('[data-cy=project-header]', { log: false }).contains(project0.projectTitle)
    cy.get('[data-cy=office-link]').should('contain', office.displayName)
    cy.goTo('projects', project1)
    cy.get('[data-cy=project-header]', { log: false }).contains(project1.projectTitle)
    cy.get('[data-cy=office-link]').should('contain', office.displayName)
    cy.goTo('pastprojects', pastproject0)
    cy.get('[data-cy=pastproject-header]', { log: false }).contains(pastproject0.projectTitle)
    cy.get('[data-cy=office-link]').should('contain', office.displayName)
    cy.goTo('pastprojects', pastproject1)
    cy.get('[data-cy=pastproject-header]', { log: false }).contains(pastproject1.projectTitle)
    cy.get('[data-cy=office-link]').should('contain', office.displayName)
    cy.percySnapshot()

    // end
    cy.exec('rm temp-office-link.txt')
    log.end()
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
