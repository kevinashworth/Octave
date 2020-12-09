/// <reference types="cypress" />

/**
 * Update Contacts to test packages/octave/lib/server/contacts/callbacks
 *
 * Reminder: Use keyword `function`, not arrow function, to access `this.items.foo`
 */

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Update Contacts', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.resetTriad()
    cy.login()
    cy.getTestingCollection('contacts')
    cy.getTestingCollection('offices')
    cy.getTestingCollection('projects')
    cy.getTestingCollection('pastprojects')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
    cy.fixture('output/callback-testing/testing-contacts.json').as('testingContacts')
    cy.fixture('output/callback-testing/testing-offices.json').as('testingOffices')
    cy.fixture('output/callback-testing/testing-projects.json').as('testingProjects')
    cy.fixture('output/callback-testing/testing-pastprojects.json').as('testingPastprojects')
  })

  // 1 to 1
  it('add project to contact', function () {
    const contact = Cypress._.find(this.testingContacts, { displayName: 'HASTY HARMSON' })
    const project = Cypress._.find(this.testingProjects, { projectTitle: 'CANADA' })
    const log = Cypress.log({
      name: 'add 1 project to contact',
      displayName: 'ADD PROJECT',
      message: [`Adding ${project.projectTitle} to ${contact.displayName}`],
      autoEnd: false
    })
    cy.visit('/contacts')
    cy.get(`a[href$=${contact.slug}][data-cy=contacts-link]`, { log: false }).click()
    cy.get('[data-cy=edit-button]', { log: false }).click({ force: true })
    cy.get('.form-section-projects').within(() => {
      cy.clickGreenAddButton()
      cy.get('.form-nested-array-inner-layout', { log: false }).each(($el, i) => { // should be [0, 1]
        cy.get($el).within(() => {
          if (i > 0) {
            cy.selectProjectAndTitle(project.projectTitle, contact.title, i)
          }
        })
      })
    })
    cy.submit()
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact.displayName)
    cy.get('[data-cy=project-link]')
      .should('have.length', 2)

    cy.get(`a[href$="${project.slug}"][data-cy=project-link]`).last().click()
    cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
    cy.get('[data-cy=contact-link]').last()
      .should('have.text', contact.displayName)
    cy.percySnapshot()

    log.end()
  })

  // 2 to 1
  it('add projects 0 & 1 to contact 2', function () {
    const contact = this.testingContacts[2]
    const testingProjects = this.testingProjects
    const log = Cypress.log({
      name: '2 to 1',
      displayName: 'ADD PROJECTS',
      message: [`Adding ${testingProjects[0].projectTitle} and ${testingProjects[1].projectTitle} to ${contact.displayName}`],
      autoEnd: false
    })
    cy.visit('/contacts')
    // add projects 0 & 1 to contact 2
    cy.get(`a[href$=${contact.slug}][data-cy=contacts-link]`, { log: false }).click()
    cy.get('[data-cy=edit-button]', { log: false }).click({ force: true })
    cy.get('.form-section-projects').within(() => {
      // click open 2 project elements
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      // now has 3 open projects - 0 preexisting, 1 2 empty
      cy.get('.form-nested-array-inner-layout')
        .each(($el, i) => {
          if (i > 0) {
            cy.get($el).within(() => {
              cy.selectProjectAndTitle(testingProjects[i - 1].projectTitle, contact.title, i)
            })
          }
        })
    })
    cy.submit()
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact.displayName)
    cy.get('[data-cy=project-link]')
      .should('have.length', 3)

    // assert contact 2 added to project 0
    cy.get(`a[href$="${testingProjects[0].slug}"][data-cy=project-link]`).last().click()
    cy.get('[data-cy=project-header]', { log: false }).contains(testingProjects[0].projectTitle)
    cy.get('[data-cy=contact-link]').last()
      .should('have.text', contact.displayName)
    cy.percySnapshot()

    // assert contact 2 added to project 1
    cy.go('back')
    cy.get(`a[href$="${testingProjects[1].slug}"][data-cy=project-link]`).last().click()
    cy.get('[data-cy=project-header]', { log: false }).contains(testingProjects[1].projectTitle)
    cy.get('[data-cy=contact-link]').last()
      .should('have.text', contact.displayName)

    log.end()
  })

  // 3 to 1
  it('add projects 3, 4, 5 to contact 1', function () {
    const contact = this.testingContacts[1]
    const testingProjects = this.testingProjects
    const log = Cypress.log({
      name: '3 to 1',
      displayName: 'ADD PROJECTS',
      message: [`Adding ${testingProjects[3].projectTitle}`, testingProjects[4].projectTitle, `${testingProjects[5].projectTitle} to ${contact.displayName}`],
      autoEnd: false
    })
    cy.visit('/contacts')

    // add projects 3, 4, 5 to contact 1
    cy.get(`a[href$=${contact.slug}][data-cy=contacts-link]`, { log: false }).click()
    cy.get('[data-cy=edit-button]', { log: false }).click({ force: true })
    cy.get('.form-section-projects').within(() => {
      // click open 3 project elements
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      // now has 4 open projects - 0 preexisting, 1 2 3 empty
      cy.get('.form-nested-array-inner-layout')
        .each(($el, i) => {
          if (i > 0) {
            cy.get($el).within(() => {
              cy.selectProjectAndTitle(testingProjects[i + 2].projectTitle, contact.title, i)
            })
          }
        })
    })
    cy.submit()
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact.displayName)
    cy.get('[data-cy=project-link]')
      .should('have.length', 4)
    cy.percySnapshot()

    // assert contact 2 added to project 3
    cy.get(`a[href$=${testingProjects[3].slug}][data-cy=project-link]`).last().click()
    cy.get('[data-cy=project-header]', { log: false }).contains(testingProjects[3].projectTitle)
    cy.get('[data-cy=contact-link]').last()
      .should('have.text', contact.displayName)

    // assert contact 2 added to project 4
    cy.go('back')
    cy.get(`a[href$=${testingProjects[4].slug}][data-cy=project-link]`).last().click()
    cy.get('[data-cy=project-header]', { log: false }).contains(testingProjects[4].projectTitle)
    cy.get('[data-cy=contact-link]').last()
      .should('have.text', contact.displayName)

    // assert contact 2 added to project 5
    cy.go('back')
    cy.get(`a[href$=${testingProjects[5].slug}][data-cy=project-link]`).last().click()
    cy.get('[data-cy=project-header]', { log: false }).contains(testingProjects[5].projectTitle)
    cy.get('[data-cy=contact-link]').last()
      .should('have.text', contact.displayName)

    log.end()
  })

  it('remove the other project from contact 0', function () {
    const contact = this.testingContacts[0]
    const project = this.testingProjects[2]
    const log = Cypress.log({
      name: '1 to 1',
      displayName: 'REMOVE PROJECTS',
      message: [`Leaving ${project.projectTitle} on ${contact.displayName}`],
      autoEnd: false
    })
    cy.visit('/contacts')
    cy.get(`a[href$=${contact.slug}][data-cy=contacts-link]`, { log: false }).click()

    // store link to project about to remove
    cy.get('[data-cy=project-link]').first().click()
    cy.location().then((loc) => {
      cy.writeFile('temp-project-link.txt', loc.pathname)
    })
    cy.go('back')

    cy.get('[data-cy=edit-button]', { log: false }).click({ force: true })
    cy.get('.form-section-projects').within(() => {
      // has 2 preexisting projects, remove first
      cy.get('.form-nested-item-remove button').first().click()
    })
    cy.submit()
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact.displayName)
    cy.get('[data-cy=office-link)')
    cy.percySnapshot()

    // assert contact 0 has 1 project
    cy.get('[data-cy=project-link]')
      .should('have.length', 1)
      .click()
    // assert project still has contact 0
    cy.get('[data-cy=contact-link]')
      .should('include.text', contact.displayName)
    // assert removed project no longer has contact 0
    cy.readFile('temp-project-link.txt').then((link) => {
      cy.visit(link)
      cy.get('[data-cy=contact-link]')
        .should('not.have.text', contact.displayName)
    })

    cy.exec('rm temp-project-link.txt')
    log.end()
  })

  it('add project 6, office 6, past project 6 to contact 3', function () {
    const contact = this.testingContacts[3]
    const office = this.testingOffices[6]
    const project = this.testingProjects[6]
    const pastproject = this.testingPastprojects[6]
    const log = Cypress.log({
      name: 'add 3 items',
      displayName: 'ADD 3 ITEMS',
      message: [`Adding 3 items to ${contact.displayName}`],
      autoEnd: false,
      consoleProps: () => {
        return {
          Contact: contact.displayName,
          Office: office.displayName,
          Project: project.projectTitle,
          'Past Project': office.displayName
        }
      }
    })
    cy.visit('/contacts')
    cy.get(`a[href$=${contact.slug}][data-cy=contacts-link]`, { log: false }).click()
    cy.get('[data-cy=edit-button]', { log: false }).click({ force: true })
    cy.get('.form-section-projects').within(() => {
      cy.clickGreenAddButton()
      cy.get('.form-nested-array-inner-layout', { log: false }).each(($el, i) => { // should be [0, 1]
        cy.get($el).within(() => {
          if (i > 0) {
            cy.selectProjectAndTitle(project.projectTitle, contact.title, i)
          }
        })
      })
    })
    cy.get('.form-section-offices').within(() => {
      cy.clickGreenAddButton()
      cy.get('.form-nested-array-inner-layout', { log: false }).each(($el, i) => { // should be [0, 1]
        cy.get($el).within(() => {
          if (i > 0) {
            cy.mySelect('officeId', office.displayName)
          }
        })
      })
    })
    cy.get('.form-section-pastProjects').click().within(() => {
      cy.clickGreenAddButton()
      cy.get('.form-nested-array-inner-layout', { log: false }).each(($el, i) => { // should be [0, 1]
        cy.get($el).within(() => {
          if (i > 0) {
            cy.selectProjectAndTitle(pastproject.projectTitle, contact.title, i)
          }
        })
      })
    })
    cy.submit()
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact.displayName)
    cy.get('[data-cy=project-link]')
      .should('have.length', 2)

    // assert project added to contact
    cy.get(`a[href$=${project.slug}][data-cy=project-link]`).last().click()
    cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
    cy.get('[data-cy=contact-link]').last()
      .should('have.text', contact.displayName)

    // assert office added to contact
    cy.visit('/contacts')
    cy.get(`a[href$=${contact.slug}][data-cy=contacts-link]`, { log: false }).click()
    cy.get(`a[href$=${office.slug}][data-cy=office-link]`).last().click()
    cy.get('[data-cy=office-header]', { log: false }).contains(office.displayName)
    cy.get('[data-cy=contact-link]').first().then((link) => {
      cy.expectInnerText(link, contact.displayName)
    })

    // assert pastproject added to contact
    cy.visit('/contacts')
    cy.get(`a[href$=${contact.slug}][data-cy=contacts-link]`, { log: false }).click()
    cy.get('[data-cy=show-hide-past-projects]').click({ log: false })
    cy.get(`a[href$=${pastproject.slug}][data-cy=pastproject-link]`).last().click()
    cy.get('[data-cy=pastproject-header]', { log: false }).contains(pastproject.projectTitle)
    cy.get('[data-cy=contact-link]').last()
      .should('have.text', contact.displayName)
    cy.percySnapshot()

    log.end()
  })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
