/// <reference types="cypress" />

/**
 * Create contacts to test packages/octave/lib/server/contacts/callbacks
 *
 * Very rough assessment of code coverage:
 *
 *  create: {
 *    async: [
 *      createAlgoliaObject,             x
 *      createContactUpdateOffices,      ✓
 *      createContactUpdateProjects,     ✓
 *      createContactUpdatePastProjects  ✓
 *    ]
 *  }
 */

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Create Project', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.resetTriad()
    cy.stubAlgolia()
    cy.login()
    // cy.getTestingCollection('contacts')
    cy.getTestingCollection('offices')
    cy.getTestingCollection('projects')
    cy.getTestingCollection('pastprojects')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
    // cy.fixture('output/callback-testing/testing-contacts.json').as('testingContacts')
    cy.fixture('output/callback-testing/testing-offices.json').as('testingOffices')
    cy.fixture('output/callback-testing/testing-projects.json').as('testingProjects')
    cy.fixture('output/callback-testing/testing-pastprojects.json').as('testingPastprojects')
    cy.fixture('callback-testing.json').as('items')
  })

  it('create contact with an office and 3 projects and past projects', function () {
    const { contact } = this.items
    const office0 = Cypress._.find(this.testingOffices, { displayName: 'MIBOO CASTING' })
    const project0 = Cypress._.find(this.testingProjects, { projectTitle: 'MEXICO' })
    const project1 = Cypress._.find(this.testingProjects, { projectTitle: 'CHINA' })
    const project2 = Cypress._.find(this.testingProjects, { projectTitle: 'CANADA' })
    const pastproject0 = Cypress._.find(this.testingPastprojects, { projectTitle: 'SHINING NETVEIN BARBERRY' })
    const pastproject1 = Cypress._.find(this.testingPastprojects, { projectTitle: 'CALIFORNIA FAGONBUSH' })
    const pastproject2 = Cypress._.find(this.testingPastprojects, { projectTitle: 'LEATHER FLOWER' })
    const log = Cypress.log({
      name: 'create contact',
      displayName: 'CREATE A CONTACT',
      message: ['Creating a contact with 1 office and 3 [past]projects.'],
      autoEnd: false
    })

    // create
    cy.visit('/contacts/new')
    cy.get('#firstName').type(contact.firstName)
    cy.get('#lastName').type(contact.lastName)
    cy.mySelect('title', contact.title)
    cy.get('#body').type(contact.body)
    cy.get('.form-section-offices').within(() => {
      cy.clickGreenAddButton()
      cy.waitForOfficeOptions()
      cy.mySelect('officeId', office0.displayName, 0)
    })
    cy.get('.form-section-projects').within(() => {
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.waitForProjectOptions()
      cy.selectProjectAndTitle(project0.projectTitle, contact.title, 0)
      cy.selectProjectAndTitle(project1.projectTitle, contact.title, 1)
      cy.selectProjectAndTitle(project2.projectTitle, contact.title, 2)
    })
    cy.get('.form-section-pastProjects').click().within(() => {
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.waitForPastProjectOptions()
      cy.selectProjectAndTitle(pastproject0.projectTitle, contact.title, 0)
      cy.selectProjectAndTitle(pastproject1.projectTitle, contact.title, 1)
      cy.selectProjectAndTitle(pastproject2.projectTitle, contact.title, 2)
    })
    cy.submit()
    cy.location().then((loc) => {
      cy.writeFile('temp-contact-link.txt', loc.pathname)
      cy.log(`created contact at ${loc.pathname}`)
    })

    // verify all 8 items after create
    cy.get('[data-cy=contact-header').should('contain', contact.firstName)
    cy.get('[data-cy=contact-header').should('contain', contact.lastName)
    cy.get('[data-cy=contact-name-title-gender-body').should('contain', contact.title)
    cy.get('[data-cy=contact-name-title-gender-body').should('contain', contact.body)
    cy.get('[data-cy=project-link]').should('have.length', 3)
    cy.get('[data-cy=project-link]').first().should('contain', project0.projectTitle)
    cy.get('[data-cy=project-link]').eq(1).should('contain', project1.projectTitle)
    cy.get('[data-cy=project-link]').last().should('contain', project2.projectTitle)
    cy.get('[data-cy=show-hide-past-projects]').click({ log: false })
    cy.get('[data-cy=pastproject-link]').should('have.length', 3) // in alphabetical order
    cy.get('[data-cy=pastproject-link]').first().should('contain', pastproject1.projectTitle)
    cy.get('[data-cy=pastproject-link]').eq(1).should('contain', pastproject2.projectTitle)
    cy.get('[data-cy=pastproject-link]').last().should('contain', pastproject0.projectTitle)
    cy.get('[data-cy=office-link]').should('have.length', 1)
    cy.get('[data-cy=office-link]').first().should('contain', office0.displayName)
    cy.goTo('offices', office0)
    cy.get('[data-cy=office-header]', { log: false }).contains(office0.displayName)
    cy.get('[data-cy=contact-link]').should('contain', contact.firstName)
    cy.get('[data-cy=contact-link]').should('contain', contact.lastName)
    cy.goTo('projects', project0)
    cy.get('[data-cy=project-header]', { log: false }).contains(project0.projectTitle)
    cy.get('[data-cy=contact-link]').should('contain', contact.firstName)
    cy.get('[data-cy=contact-link]').should('contain', contact.lastName)
    cy.goTo('projects', project1)
    cy.get('[data-cy=project-header]', { log: false }).contains(project1.projectTitle)
    cy.get('[data-cy=contact-link]').should('contain', contact.firstName)
    cy.get('[data-cy=contact-link]').should('contain', contact.lastName)
    cy.goTo('projects', project2)
    cy.get('[data-cy=project-header]', { log: false }).contains(project2.projectTitle)
    cy.get('[data-cy=contact-link]').should('contain', contact.firstName)
    cy.get('[data-cy=contact-link]').should('contain', contact.lastName)
    cy.goTo('pastprojects', pastproject0)
    cy.get('[data-cy=pastproject-header]', { log: false }).contains(pastproject0.projectTitle)
    cy.get('[data-cy=contact-link]').should('contain', contact.firstName)
    cy.get('[data-cy=contact-link]').should('contain', contact.lastName)
    cy.goTo('pastprojects', pastproject1)
    cy.get('[data-cy=pastproject-header]', { log: false }).contains(pastproject1.projectTitle)
    cy.get('[data-cy=contact-link]').should('contain', contact.firstName)
    cy.get('[data-cy=contact-link]').should('contain', contact.lastName)
    cy.goTo('pastprojects', pastproject2)
    cy.get('[data-cy=pastproject-header]', { log: false }).contains(pastproject2.projectTitle)
    cy.get('[data-cy=contact-link]').should('contain', contact.firstName)
    cy.get('[data-cy=contact-link]').should('contain', contact.lastName)
    cy.get('[data-cy=office-link]')
    cy.percySnapshot()

    // end
    cy.exec('rm temp-contact-link.txt')
    log.end()
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
