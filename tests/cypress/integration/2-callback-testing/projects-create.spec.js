/// <reference types="cypress" />

/**
 * Create Projects to test packages/octave/lib/server/projects/callbacks
 *
 * Reminder: Use keyword `function`, not arrow function, to access `this.items.foo`
 */

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Projects Create', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.resetTriad()
    cy.stubAlgolia()
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
    cy.fixture('callback-testing.json').as('items')
  })

  it('create project with 3 contacts and offices, then remove 2 of each', function () {
    const { project } = this.items
    const contact0 = Cypress._.find(this.testingContacts, { displayName: 'COBBIE CHATER' })
    const contact1 = Cypress._.find(this.testingContacts, { displayName: 'SHANE SAVINS' })
    const contact2 = Cypress._.find(this.testingContacts, { displayName: 'ZERO MOSTEL' })
    const office0 = Cypress._.find(this.testingOffices, { displayName: 'MIBOO CASTING' })
    const office1 = Cypress._.find(this.testingOffices, { displayName: 'TALANE CASTING' })
    const office2 = Cypress._.find(this.testingOffices, { displayName: 'DABSHOTS CASTING' })
    const log = Cypress.log({
      name: 'create and update',
      displayName: 'CREATE A PROJECT THEN UPDATE',
      message: ['Creating a project then remove 2 out of 3 contacts.'],
      autoEnd: false
    })

    // create
    cy.visit('/projects/new')
    cy.get('#projectTitle').type(project.projectTitle)
    cy.mySelect('projectType', project.projectType)
    cy.mySelect('status', project.status)
    cy.get('#summary').type(project.summary)
    cy.get('.form-section-contacts').within(() => {
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.waitForContactOptions()
      cy.selectContactAndTitle(contact0.displayName, contact0.title, 0)
      cy.selectContactAndTitle(contact1.displayName, contact1.title, 1)
      cy.selectContactAndTitle(contact2.displayName, contact2.title, 2)
    })
    cy.get('.form-section-offices').within(() => {
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.waitForOfficeOptions()
      cy.mySelect('officeId', office0.displayName, 0)
      cy.mySelect('officeId', office1.displayName, 1)
      cy.mySelect('officeId', office2.displayName, 2)
    })
    cy.submit()
    cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
    cy.location().then((loc) => {
      cy.writeFile('temp-project-link.txt', loc.pathname)
      cy.log(`created project at ${loc.pathname}`)
    })

    // verify all 5 items after create
    cy.get('[data-cy=project-header').should('contain', project.projectTitle)
    cy.get('[data-cy=contact-link]').should('have.length', 3)
    cy.get('[data-cy=contact-link]').first().should('contain', contact0.displayName)
    cy.get('[data-cy=contact-link]').eq(1).should('contain', contact1.displayName)
    cy.get('[data-cy=contact-link]').last().should('contain', contact2.displayName)
    cy.get('[data-cy=office-link]').should('have.length', 3)
    cy.get('[data-cy=office-link]').first().should('contain', office0.displayName)
    cy.get('[data-cy=office-link]').eq(1).should('contain', office1.displayName)
    cy.get('[data-cy=office-link]').last().should('contain', office2.displayName)
    cy.goTo('contacts', contact0)
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact0.displayName)
    cy.get('[data-cy=project-link]').should('contain', project.projectTitle)
    cy.goTo('contacts', contact1)
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact1.displayName)
    cy.get('[data-cy=project-link]').should('contain', project.projectTitle)
    cy.goTo('contacts', contact2)
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact2.displayName)
    cy.get('[data-cy=project-link]').should('contain', project.projectTitle)
    cy.goTo('offices', office0)
    cy.get('[data-cy=office-header]', { log: false }).contains(office0.displayName)
    cy.get('[data-cy=project-link]').should('contain', project.projectTitle)
    cy.goTo('offices', office1)
    cy.get('[data-cy=office-header]', { log: false }).contains(office1.displayName)
    cy.get('[data-cy=project-link]').should('contain', project.projectTitle)
    cy.goTo('offices', office2)
    cy.get('[data-cy=office-header]', { log: false }).contains(office2.displayName)
    cy.get('[data-cy=project-link]').should('contain', project.projectTitle)

    // edit
    cy.readFile('temp-project-link.txt').then((link) => {
      cy.visit(link)
      cy.get('[data-cy=contact-link]').should('have.length', 3)
      cy.get('[data-cy=office-link]').should('have.length', 3)
      cy.edit()
      cy.get('.form-section-contacts').within(() => {
        cy.clickRedRemoveButton(2)
        cy.clickRedRemoveButton(0)
      })
      cy.get('.form-section-offices').within(() => {
        cy.clickRedRemoveButton(2)
        cy.clickRedRemoveButton(0)
      })
      cy.submit()

      // verify all 5 items after udpate
      cy.get('[data-cy=project-header').should('contain', project.projectTitle)
      cy.get('[data-cy=contact-link]').should('have.length', 1)
      cy.get('[data-cy=contact-link]').should('contain', contact1.displayName)
      cy.get('[data-cy=office-link]').should('have.length', 1)
      cy.get('[data-cy=office-link]').should('contain', office1.displayName)
      cy.goTo('contacts', contact0)
      cy.get('[data-cy=contact-header]', { log: false }).contains(contact0.displayName)
      cy.get('[data-cy=project-link]').should('not.contain', project.projectTitle)
      cy.visit('/contacts')
      cy.get(`a[href$=${contact1.slug}][data-cy=contacts-link]`, { log: false }).click()
      cy.get('[data-cy=contact-header]', { log: false }).contains(contact1.displayName)
      cy.get('[data-cy=project-link]').should('contain', project.projectTitle)
      cy.visit('/contacts')
      cy.get(`a[href$=${contact2.slug}][data-cy=contacts-link]`, { log: false }).click()
      cy.get('[data-cy=contact-header]', { log: false }).contains(contact2.displayName)
      cy.get('[data-cy=project-link]').should('not.exist')
      cy.visit('/offices')
      cy.get(`a[href$=${office0.slug}][data-cy=offices-link]`, { log: false }).click()
      cy.get('[data-cy=office-header]', { log: false }).contains(office0.displayName)
      cy.get('[data-cy=project-link]').should('not.exist')
      cy.visit('/offices')
      cy.get(`a[href$=${office1.slug}][data-cy=offices-link]`, { log: false }).click()
      cy.get('[data-cy=office-header]', { log: false }).contains(office1.displayName)
      cy.get('[data-cy=project-link]').should('contain', project.projectTitle)
      cy.visit('/offices')
      cy.get(`a[href$=${office2.slug}][data-cy=offices-link]`, { log: false }).click()
      cy.get('[data-cy=office-header]', { log: false }).contains(office2.displayName)
      cy.get('[data-cy=project-link]').should('not.contain', project.projectTitle)
    })
    cy.percySnapshot()

    cy.exec('rm temp-project-link.txt')
    log.end()
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
