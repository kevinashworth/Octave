/// <reference types="cypress" />

/**
 * Update Office to test packages/octave/lib/server/offices/callbacks.
 */

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

describe('Update Office', () => {
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

  it('add project to office', function () {
    const office = Cypress._.find(this.testingOffices, { displayName: 'KAZIO CASTING' })
    const project = Cypress._.find(this.testingProjects, { projectTitle: 'BANGLADESH' })
    const log = Cypress.log({
      name: 'add 1 project to office',
      displayName: 'ADD PROJECT',
      message: [`Adding ${project.projectTitle} to ${office.displayName}`],
      autoEnd: false
    })
    // update
    cy.goTo('offices', office)
    cy.edit()
    cy.get('.form-section-projects').within(() => {
      cy.clickGreenAddButton()
      cy.waitForProjectOptions2()
      cy.mySelect('projectId', project.projectTitle, 2)
    })
    cy.submit()

    // assert on office
    cy.get('[data-cy=office-header]', { log: false }).contains(office.displayName)
    cy.get('[data-cy=project-link]')
      .should('have.length', 3)
    cy.percySnapshot()

    // assert on project
    cy.get(`a[href$="${project.slug}"][data-cy=project-link]`).click()
    cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
    cy.get('[data-cy=office-link]').last()
      .should('have.text', office.displayName)
    cy.percySnapshot()

    log.end()
  })

  it('add 3 contacts to office', function () {
    const office = Cypress._.find(this.testingOffices, { displayName: 'KAZIO CASTING' })
    const contact0 = Cypress._.find(this.testingContacts, { displayName: 'ZERO MOSTEL' })
    const contact1 = Cypress._.find(this.testingContacts, { displayName: 'HASTY HARMSON' })
    const contact2 = Cypress._.find(this.testingContacts, { displayName: 'QUINN QUICK' })
    const log = Cypress.log({
      name: '3 to 1',
      displayName: 'ADD PROJECTS',
      message: [`Adding ${contact0.displayName}, ${contact1.displayName}, ${contact2.displayName} to ${office.displayName}`],
      autoEnd: false
    })

    cy.goTo('offices', office)
    cy.edit()
    cy.get('.form-section-contacts').within(() => {
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.clickGreenAddButton()
      cy.waitForContactOptions()
      cy.selectContactAndTitle(contact0.displayName, contact0.title, 1) // 1 because already has SHANE SAVINS
      cy.selectContactAndTitle(contact1.displayName, contact1.title, 2)
      cy.selectContactAndTitle(contact2.displayName, contact2.title, 3)
    })
    cy.submit()

    // assert office is updated
    cy.get('[data-cy=office-header]', { log: false }).contains(office.displayName)
    cy.get('[data-cy=contact-link]')
      .should('have.length', 4)
    cy.percySnapshot()

    // assert contact0 has office
    cy.goTo('contacts', contact0)
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact0.displayName)
    cy.get('[data-cy=office-link]')
      .should('have.text', office.displayName)

    // assert contact1 has office
    cy.go('back')
    cy.get(`a[href$=${contact1.slug}][data-cy=contact-link]`).click()
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact1.displayName)
    cy.get('[data-cy=office-link]').should('have.length', 2)
    cy.get('[data-cy=office-link]').last()
      .should('have.text', office.displayName)

    // assert contact2 has office
    cy.goTo('contacts', contact2)
    cy.get('[data-cy=contact-header]', { log: false }).contains(contact2.displayName)
    cy.get('[data-cy=office-link]')
      .should('have.text', office.displayName)

    log.end()
  })

  it('add past project, remove project from office', function () {
    const office = Cypress._.find(this.testingOffices, { displayName: 'WORDPEDIA CASTING' })
    const project = Cypress._.find(this.testingProjects, { projectTitle: 'MEXICO' })
    const pastproject = Cypress._.find(this.testingPastprojects, { projectTitle: 'CALIFORNIA FAGONBUSH' })
    const log = Cypress.log({
      name: 'add past project to, remove project from office',
      displayName: 'ADD PAST PROJECT',
      message: [`Adding ${pastproject.projectTitle} to ${office.displayName}, removing ${project.projectTitle}`],
      autoEnd: false
    })

    // assert office before
    cy.goTo('offices', office)
    cy.get('[data-cy=office-header]', { log: false }).contains(office.displayName)
    cy.get('[data-cy=project-link]')
      .should('have.length', 1)
    cy.showPastProjects()
    cy.get('[data-cy=pastproject-link]')
      .should('have.length', 1)
    cy.percySnapshot()

    // assert on project to be removed
    cy.goTo('projects', project)
    cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
    cy.get('[data-cy=office-link]')
      .should('have.length', 1)

    // update
    cy.goTo('offices', office)
    cy.edit()
    cy.get('.form-section-projects').within(() => {
      cy.clickRedRemoveButton(0)
    })
    cy.get('.form-section-pastProjects').click().within(() => {
      cy.clickGreenAddButton()
      cy.waitForProjectOptions2()
      cy.mySelect('projectId', pastproject.projectTitle, 1)
    })
    cy.submit()

    // assert office after
    cy.get('[data-cy=office-header]', { log: false }).contains(office.displayName)
    cy.get('[data-cy=project-link]')
      .should('not.exist')
    cy.showPastProjects()
    cy.get('[data-cy=pastproject-link]')
      .should('have.length', 2)
    cy.percySnapshot()

    // assert on added past project
    cy.goTo('pastprojects', pastproject)
    cy.get('[data-cy=pastproject-header]', { log: false }).contains(pastproject.projectTitle)
    cy.get('[data-cy=office-link]').last()
      .should('have.text', office.displayName)
    cy.percySnapshot()

    // assert on removed project
    cy.goTo('projects', project)
    cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
    cy.get('[data-cy=office-link]')
      .should('not.exist')
    cy.percySnapshot()

    log.end()
  })

  // it('remove the other project from contact 0', function () {
  //   const contact = this.testingContacts[0]
  //   const project = this.testingProjects[2]
  //   const log = Cypress.log({
  //     name: '1 to 1',
  //     displayName: 'REMOVE PROJECTS',
  //     message: [`Leaving ${project.projectTitle} on ${contact.displayName}`],
  //     autoEnd: false
  //   })
  //   cy.visit('/contacts')
  //   cy.get(`a[href$=${contact.slug}][data-cy=contacts-link]`, { log: false }).click()

  //   // store link to project about to remove
  //   cy.get('[data-cy=project-link]').first().click()
  //   cy.location().then((loc) => {
  //     cy.writeFile('temp-project-link.txt', loc.pathname)
  //   })

  //   // edit the contact
  //   cy.go('back')
  //   cy.edit()
  //   cy.get('.form-section-projects').within(() => {
  //     // has 2 preexisting projects, remove first
  //     cy.get('.form-nested-item-remove button').first().click()
  //   })
  //   cy.submit()

  //   // assertions on the result
  //   cy.get('[data-cy=contact-header]', { log: false }).contains(contact.displayName)
  //   cy.get('[data-cy=office-link]')
  //   cy.percySnapshot()

  //   // assert contact has 1 project
  //   cy.get('[data-cy=project-link]')
  //     .should('have.length', 1)
  //     .click()

  //   // assert project still has contact 0
  //   cy.get('[data-cy=contact-link]')
  //     .should('include.text', contact.displayName)

  //   // assert removed project no longer has contact 0
  //   cy.readFile('temp-project-link.txt').then((link) => {
  //     cy.visit(link)
  //     cy.get('[data-cy=contact-link]')
  //       .should('not.have.text', contact.displayName)
  //   })

  //   cy.exec('rm temp-project-link.txt')
  //   log.end()
  // })

  // it('add project 6, office 6, past project 6 to contact 3', function () {
  //   const contact = this.testingContacts[3]
  //   const office = this.testingOffices[6]
  //   const project = this.testingProjects[6]
  //   const pastproject = this.testingPastprojects[6]
  //   const log = Cypress.log({
  //     name: 'add 3 items',
  //     displayName: 'ADD 3 ITEMS',
  //     message: [`Adding 3 items to ${contact.displayName}`],
  //     autoEnd: false,
  //     consoleProps: () => {
  //       return {
  //         Contact: contact.displayName,
  //         Office: office.displayName,
  //         Project: project.projectTitle,
  //         'Past Project': office.displayName
  //       }
  //     }
  //   })

  //   // edit contact 3
  //   cy.visit('/contacts')
  //   cy.get(`a[href$=${contact.slug}][data-cy=contacts-link]`, { log: false }).click()
  //   cy.get('[data-cy=edit-button]', { log: false }).click({ force: true })
  //   cy.get('.form-section-projects').within(() => {
  //     cy.clickGreenAddButton()
  //     cy.get('.form-nested-array-inner-layout', { log: false }).each(($el, i) => { // should be [0, 1]
  //       cy.get($el).within(() => {
  //         if (i > 0) {
  //           cy.selectProjectAndTitle(project.projectTitle, contact.title, i)
  //         }
  //       })
  //     })
  //   })
  //   cy.get('.form-section-offices').within(() => {
  //     cy.clickGreenAddButton()
  //     cy.get('.form-nested-array-inner-layout', { log: false }).each(($el, i) => { // should be [0, 1]
  //       cy.get($el).within(() => {
  //         if (i > 0) {
  //           cy.mySelect('officeId', office.displayName)
  //         }
  //       })
  //     })
  //   })
  //   cy.get('.form-section-pastProjects').click().within(() => {
  //     cy.clickGreenAddButton()
  //     cy.get('.form-nested-array-inner-layout', { log: false }).each(($el, i) => { // should be [0, 1]
  //       cy.get($el).within(() => {
  //         if (i > 0) {
  //           cy.selectProjectAndTitle(pastproject.projectTitle, contact.title, i)
  //         }
  //       })
  //     })
  //   })
  //   cy.submit()

  //   // asserts on updated contact
  //   cy.get('[data-cy=contact-header]', { log: false }).contains(contact.displayName)
  //   cy.get('[data-cy=office-link]')
  //     .should('have.length', 2)
  //   cy.get('[data-cy=project-link]')
  //     .should('have.length', 2)
  //   cy.get('[data-cy=show-hide-past-projects]').click({ log: false })
  //   cy.get('[data-cy=pastproject-link]')
  //     .should('have.length', 2)

  //   // assert project added to contact, then assert contact added to project
  //   cy.get(`a[href$=${project.slug}][data-cy=project-link]`)
  //     .should('have.length', 1).click()
  //   cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
  //   cy.get('[data-cy=contact-link]').last()
  //     .should('have.text', contact.displayName)
  //   cy.percySnapshot()

  //   // assert office added to contact, then assert contact added to office
  //   cy.goTo('contacts', contact)
  //   cy.get('[data-cy=contact-header]', { log: false }).contains(contact.lastName)
  //   cy.get(`a[href$=${office.slug}][data-cy=office-link]`)
  //     .should('have.length', 1).click()
  //   cy.get('[data-cy=office-header]', { log: false }).contains(office.displayName)
  //   cy.get('[data-cy=contact-link]').should('contain', contact.firstName)
  //   cy.get('[data-cy=contact-link]').should('contain', contact.lastName)
  //   cy.percySnapshot()

  //   // assert pastproject added to contact, then assert contact added to pastproject
  //   cy.goTo('contacts', contact)
  //   cy.get('[data-cy=contact-header]', { log: false }).contains(contact.firstName)
  //   cy.get('[data-cy=show-hide-past-projects]').click({ log: false })
  //   cy.get(`a[href$=${pastproject.slug}][data-cy=pastproject-link]`)
  //     .should('have.length', 1).click()
  //   cy.get('[data-cy=pastproject-header]', { log: false }).contains(pastproject.projectTitle)
  //   cy.get('[data-cy=contact-link]').last()
  //     .should('have.text', contact.displayName)
  //   cy.percySnapshot()

  //   log.end()
  // })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
