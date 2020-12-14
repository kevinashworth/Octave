/// <reference types="cypress" />

const clear = Cypress.LocalStorage.clear
const doNotClearLocalStorage = () => { }

// `react-sortable-hoc` mouse-based drag-and-drop is not working in Cypress, so use
// keyboard accessibility (space bar to select, arrow to move, space bar to drop)
// by implementing tabIndex in MyFormNestedArrayLayout.
// see https://github.com/clauderic/react-sortable-hoc#accessibility

describe('Edit Order by Drag n Drop', () => {
  before(() => {
    Cypress.LocalStorage.clear = doNotClearLocalStorage
    cy.resetTriad()
    cy.stubAlgolia()
    cy.login()
    cy.visit('/')
    cy.getTestingCollection('contacts')
    cy.getTestingCollection('offices')
    cy.getTestingCollection('projects')
    // cy.getTestingCollection('pastprojects')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('meteor_login_token')
    cy.fixture('output/callback-testing/testing-contacts.json').as('testingContacts')
    cy.fixture('output/callback-testing/testing-offices.json').as('testingOffices')
    cy.fixture('output/callback-testing/testing-projects.json').as('testingProjects')
    // cy.fixture('output/callback-testing/testing-pastprojects.json').as('testingPastprojects')
  })

  it('change order of projects and past projects on a contact', function () {
    const contact = Cypress._.find(this.testingContacts, { lastName: 'RUCKMAN' }) // has 3 projects and 3 past projects
    const log = Cypress.log({
      name: 'drag projects and past projects',
      displayName: 'DRAG-N-DROP ON CONTACT',
      message: [`Reordering projects on ${contact.displayName}.`],
      autoEnd: false
    })

    cy.goTo('contacts', contact)
    cy.get('[data-cy=project-link]').should('have.length', 3)
    cy.get('[data-cy=project-link]').first().should('contain', 'CHINA')
    cy.get('[data-cy=project-link]').eq(1).should('contain', 'BANGLADESH')
    cy.get('[data-cy=project-link]').last().should('contain', 'CANADA')
    cy.get('[data-cy=show-hide-past-projects]').click({ log: false })
    cy.get('[data-cy=pastproject-link]').should('have.length', 3)
    // Past Projects get sorted, so we need to look at the edit page to see their true order
    log.snapshot()
    cy.edit()
    cy.get('.form-section-projects').within(() => {
      log.snapshot()
      cy.waitForProjectOptions()
      cy.get('[data-cy=drag-handle-0]').type(' {downarrow}{downarrow} ', { force: true })
    })
    cy.get('.form-section-pastProjects').click().within(() => {
      log.snapshot()
      cy.waitForPastProjectOptions()
      cy.expectInnerText('#projectId0', 'ARIZONA MIMOSA')
      cy.expectInnerText('#projectId1', 'WHITE BOG ORCHID')
      cy.expectInnerText('#projectId2', 'LEATHER FLOWER')
      cy.get('[data-cy=drag-handle-2]').type(' {uparrow} ', { force: true })
    })

    cy.submit()
    cy.location().then((loc) => {
      cy.writeFile('temp-contact-link.txt', loc.pathname)
      cy.log(`updated contact at ${loc.pathname}`)
    })
    cy.get('[data-cy=project-link]').should('have.length', 3)
    cy.get('[data-cy=project-link]').first().should('contain', 'BANGLADESH')
    cy.get('[data-cy=project-link]').eq(1).should('contain', 'CANADA')
    cy.get('[data-cy=project-link]').last().should('contain', 'CHINA')
    cy.get('[data-cy=show-hide-past-projects]').click({ log: false })
    cy.get('[data-cy=pastproject-link]').should('have.length', 3)
    cy.edit()
    cy.get('.form-section-pastProjects').click().within(() => {
      log.snapshot()
      cy.waitForPastProjectOptions()
      cy.expectInnerText('#projectId0', 'ARIZONA MIMOSA')
      cy.expectInnerText('#projectId1', 'LEATHER FLOWER')
      cy.expectInnerText('#projectId2', 'WHITE BOG ORCHID')
    })
    cy.cancel()

    // end
    cy.exec('rm temp-contact-link.txt')
    log.end()
  })

  it('change order of links on an office', function () {
    const office = Cypress._.find(this.testingOffices, { displayName: 'ZOOMZONE CASTING' }) // has 18 links
    const log = Cypress.log({
      name: 'drag links',
      displayName: 'DRAG-N-DROP ON OFFICE',
      message: [`Reordering links on ${office.displayName}.`],
      autoEnd: false
    })

    cy.goTo('offices', office)
    cy.get('[data-cy=profile-link]').should('have.length', 18)
    cy.get('[data-cy=profile-link]').first().should('contain', 'ABC')
    cy.get('[data-cy=profile-link]').last().should('contain', 'Wiki')
    cy.get('.fab.fa-facebook')
    cy.get('.fad.fa-tv-retro')
    cy.percySnapshot('All 18 links with icons, in alphabetical order')
    log.snapshot()
    cy.edit()
    cy.get('.form-section-links').within(() => {
      log.snapshot()
      cy.get('[id^=data-cy-my-creatable-select]', { log: false })
      cy.get('[data-cy=drag-handle-0]').type(' {downarrow} ', { force: true })
      cy.get('[data-cy=drag-handle-17]').type(' {uparrow} ', { force: true })
    })
    cy.submit()
    cy.location().then((loc) => {
      cy.writeFile('temp-office-link.txt', loc.pathname)
      cy.log(`updated office at ${loc.pathname}`)
    })
    cy.get('[data-cy=profile-link]').should('have.length', 18)
    cy.get('[data-cy=profile-link]').first().should('contain', 'CBS')
    cy.get('[data-cy=profile-link]').last().should('contain', 'Website')

    // end
    cy.exec('rm temp-office-link.txt')
    log.end()
  })

  it('change order of contacts and offices on a project', function () {
    const project = Cypress._.find(this.testingProjects, { projectTitle: 'INDONESIA' })
    const log = Cypress.log({
      name: 'drag contacts and offices',
      displayName: 'DRAG-N-DROP ON PROJECT',
      message: [`Reordering contacts and offices on ${project.projectTitle}.`],
      autoEnd: false
    })

    // verify before
    cy.goTo('projects', project)
    cy.get('[data-cy=contact-link]').should('have.length', 2)
    cy.get('[data-cy=contact-link]').first().should('contain', 'COBBIE CHATER')
    cy.get('[data-cy=contact-link]').last().should('contain', 'SHANE SAVINS')
    cy.get('[data-cy=office-link]').should('have.length', 2)
    cy.get('[data-cy=office-link]').first().should('contain', 'SKIMIA CASTING')
    cy.get('[data-cy=office-link]').last().should('contain', 'KAZIO CASTING')

    // edit
    cy.edit()
    cy.get('.form-section-contacts').within(() => {
      cy.waitForContactOptions()
      cy.get('[data-cy=drag-handle-0]').type(' {downarrow} ', { force: true })
    })
    cy.get('.form-section-offices').within(() => {
      cy.waitForOfficeOptions()
      cy.get('[data-cy=drag-handle-1]').type(' {uparrow} ', { force: true })
    })
    cy.submit()
    cy.location().then((loc) => {
      cy.writeFile('temp-project-link.txt', loc.pathname)
      cy.log(`updated project at ${loc.pathname}`)
    })

    // verify after
    cy.get('[data-cy=contact-link]').should('have.length', 2)
    cy.get('[data-cy=contact-link]').first().should('contain', 'SHANE SAVINS')
    cy.get('[data-cy=contact-link]').last().should('contain', 'COBBIE CHATER')
    cy.get('[data-cy=office-link]').should('have.length', 2)
    cy.get('[data-cy=office-link]').first().should('contain', 'KAZIO CASTING')
    cy.get('[data-cy=office-link]').last().should('contain', 'SKIMIA CASTING')

    // end
    cy.exec('rm temp-project-link.txt')
    log.end()
  })

  it('remove one contact; cannot reorder other contacts', function () {
    const project = Cypress._.find(this.testingProjects, { projectTitle: 'SWEDEN' })
    const log = Cypress.log({
      name: 'delete disables reorder',
      displayName: 'DELETE & DRAG-N-DROP',
      message: [`Deleting & reordering contacts on ${project.projectTitle}.`],
      autoEnd: false
    })

    // verify before
    cy.goTo('projects', project)
    cy.get('[data-cy=contact-link]').should('have.length', 3)
    cy.get('[data-cy=contact-link]').first().should('contain', 'ADELIND ARONOW')
    cy.get('[data-cy=contact-link]').eq(1).should('contain', 'PANDORA PAFFLEY')
    cy.get('[data-cy=contact-link]').last().should('contain', 'BRODIE BYRON')

    // edit
    cy.edit()
    cy.get('.form-section-contacts').within(() => {
      cy.waitForContactOptions()
      cy.clickRedRemoveButton(1)
      cy.get('[data-cy=drag-handle-0]').type(' {downarrow} ', { force: true })
    })
    cy.submit()

    // verify after
    cy.get('[data-cy=project-header]', { log: false }).contains(project.projectTitle)
    cy.get('[data-cy=contact-link]').should('have.length', 2)
    cy.get('[data-cy=contact-link]').first().should('contain', 'ADELIND ARONOW')
    cy.get('[data-cy=contact-link]').last().should('contain', 'BRODIE BYRON')

    log.end()
  })

  // it('actual mouse trigger test', function () {
  //   const project = Cypress._.find(this.testingProjects, { projectTitle: 'INDONESIA' }) // has 8 links
  //   const log = Cypress.log({
  //     name: 'drag contacts and offices',
  //     displayName: 'DRAG-N-DROP ON PROJECT',
  //     message: [`Reordering contacts and offices on ${project.projectTitle}.`],
  //     autoEnd: false
  //   })

  //   cy.goTo('projects', project)
  //   cy.edit()
  //   cy.waitForContactOptions()
  //   cy.get('.form-section-contacts [data-cy=drag-handle-0]').scrollIntoView()
  //   cy.wait(1000)
  //   cy.dragAndDrop({
  //     subject: '.form-section-contacts [data-cy=drag-handle-1]',
  //     target: '.form-section-contacts .form-section-heading'
  //   })
  //   cy.wait(1000)
  //   cy.submit()

  //   log.end()
  // })

  after(() => {
    Cypress.LocalStorage.clear = clear
  })
})
