/// <reference types="cypress" />

/*
 * Test the creation of new items, and then test the simple assigning of
 * projects to contacts and offices.
 *
 * In update-contacts.spec.js, prepared items are already in the Triad database,
 * and we use those to test Vulcan callbacks.
 *
 * Reminder: Use keyword `function`, not arrow function, to access `this.items.foo`
 */

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Create New Items', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.resetTriad()
    cy.stubAlgolia()
    cy.login()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
    cy.fixture('callback-testing.json').as('items')
  })

  it('create contact, office, project, pastproject', function () {
    const { contact, office, project, pastproject } = this.items
    let beforeStat = 0

    // Statistics before
    cy.visit('/statistics/list')
    cy.get('[data-cy=features-casting]').then(($span) => {
      beforeStat = parseInt($span.text())
      cy.log('features stat before', beforeStat)
    })

    cy.visit('/contacts/new')
    cy.get('#firstName').type(contact.firstName)
    cy.get('#lastName').type(contact.lastName)
    cy.mySelect('title', contact.title)
    cy.get('#body').type(contact.body)
    cy.get('.form-submit > button').click()
    cy.get('[data-cy=contact-header]').should('contain', contact.lastName)
    cy.location().then((location) => {
      cy.log(`created contact at ${location.pathname}`)
    })

    cy.visit('/offices/new')
    cy.get('#displayName').type(office.displayName)
    cy.get('#body').type(office.body)
    cy.get('.form-submit > button').click()
    cy.get('[data-cy=office-header]').should('contain', office.displayName)
    cy.location().then((location) => {
      cy.log(`created office at ${location.pathname}`)
    })

    cy.visit('/projects/new')
    cy.get('#projectTitle').type(project.projectTitle)
    cy.mySelect('projectType', project.projectType)
    cy.mySelect('status', project.status)
    cy.get('#summary').type(project.summary)
    cy.get('.form-submit > button').click()
    cy.get('[data-cy=project-header]').should('contain', project.projectTitle)
    cy.location().then((location) => {
      cy.log(`created project at ${location.pathname}`)
    })

    cy.visit('/projects/new')
    cy.get('#projectTitle').type(pastproject.projectTitle)
    cy.mySelect('projectType', pastproject.projectType)
    cy.mySelect('status', pastproject.status)
    cy.get('#summary').type(pastproject.summary)
    cy.get('.form-submit > button').click()
    cy.get('[data-cy=project-header]').should('contain', pastproject.projectTitle)
    cy.get('[data-cy=edit-button]', { log: false }).click({ force: true })
    cy.get('.form-submit > button').click()
    cy.get('[data-cy=pastproject-header]').should('contain', pastproject.projectTitle)
    cy.location().then((location) => {
      cy.log(`created past project at ${location.pathname}`)
    })

    // Statistics after
    cy.visit('/statistics/list')
    cy.get('[data-cy=features-casting]').then(($span) => {
      const stat = parseInt($span.text())
      cy.log('features stat after', stat)
      expect(stat - beforeStat).to.eq(1)
    })
  })

  it('add project & pastproject to contact, then to office', function () {
    const { contact, office, project, pastproject } = this.items

    cy.visit('/contacts')
    cy.get(`a[href$=${contact.slug}][data-cy=contacts-link]`, { log: false }).click()
    cy.get('[data-cy=contact-header]').contains(contact.firstName)
    cy.get('[data-cy=edit-button]', { log: false }).click({ force: true })
    cy.get('.form-section-projects').within(() => {
      cy.clickGreenAddButton()
      cy.selectProjectAndTitle(project.projectTitle, contact.title)
    })
    cy.get('.form-section-pastProjects').click().within(() => {
      cy.clickGreenAddButton()
      cy.selectProjectAndTitle(pastproject.projectTitle, contact.title)
    })
    cy.get('.form-submit > button').click()
    cy.get('[data-cy=contact-header]').contains(contact.lastName)
    cy.get('[data-cy=project-link]').last()
      .should('have.text', project.projectTitle)
    cy.get('[data-cy=show-hide-past-projects]').click({ log: false })
    cy.get('[data-cy=pastproject-link]').last()
      .should('have.text', pastproject.projectTitle)

    cy.visit('/offices')
    cy.get(`a[href$=${office.slug}][data-cy=offices-link]`, { log: false }).click()
    cy.get('[data-cy=office-header]').contains(office.displayName)
    cy.get('[data-cy=edit-button]', { log: false }).click({ force: true })
    cy.get('.form-section-projects').within(() => {
      cy.clickGreenAddButton()
      cy.mySelect('projectId', project.projectTitle)
    })
    cy.get('.form-section-pastProjects').click().within(() => {
      cy.clickGreenAddButton()
      cy.mySelect('projectId', pastproject.projectTitle)
    })
    cy.get('.form-submit > button').click()
    cy.get('[data-cy=office-header]').contains(office.displayName)
    cy.get('[data-cy=project-link]').last()
      .should('have.text', project.projectTitle)
    cy.get('[data-cy=show-hide-past-projects]').click({ log: false })
    cy.get('[data-cy=pastproject-link]').last()
      .should('have.text', pastproject.projectTitle)
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
