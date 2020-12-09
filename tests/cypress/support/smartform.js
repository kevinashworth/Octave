/// <reference types="Cypress" />

Cypress.Commands.add('edit', () => {
  Cypress.log({
    name: 'edit',
    displayName: 'EDIT',
    message: ['Click Edit button']
  })
  cy.get('[data-cy=edit-button]').click({ force: true })
})

Cypress.Commands.add('submit', () => {
  Cypress.log({
    name: 'submit',
    displayName: 'SUBMIT',
    message: ['Submit form']
  })
  cy.get('.form-submit > button').click()
})

Cypress.Commands.add('cancel', () => {
  Cypress.log({
    name: 'cancel',
    displayName: 'CANCEL',
    message: ['Cancel form edit']
  })
  cy.get('.form-submit > .form-cancel').click()
})

Cypress.Commands.add('clickGreenAddButton', () => {
  Cypress.log({
    name: 'add',
    displayName: 'ADD',
    message: ['Click green (+) button']
  })
  // use force:true because sometimes the options dropdown covers the green button
  cy.get('button.form-nested-add', { log: false }).click({ log: false, force: true })
})

Cypress.Commands.add('clickRedRemoveButton', (index = 0) => {
  Cypress.log({
    name: 'remove',
    displayName: 'REMOVE',
    message: ['Click red (—) button']
  })
  cy.get('.form-nested-item-remove button', { log: false }).then((buttons) => {
    cy.log('Number of red buttons before clicking button number', [buttons.length, index])
    if (buttons.length > 0) {
      buttons[index].click({ log: false })
    } else {
      buttons.click({ log: false })
    }
  })
})

// works for MySelect, whether options from static array or options from database query
Cypress.Commands.add('mySelect', (selector, option, index = 0) => {
  const log = Cypress.log({
    name: 'select',
    displayName: 'SELECT 1',
    message: [`MySelect: ${selector}, ${option}`],
    autoEnd: false
  })
  const re = new RegExp(`^${option}$`) // exact match
  cy.get(`.input-${selector}`, { log: false }).then((inputs) => {
    cy.get(inputs[index], { log: false }).within({ log: false }, () => {
      cy.get('.react-select-virtualized input', { log: false })
        .click({ force: true, log: false })
        .type(option)
        .get('.fast-option', { log: false })
        .contains(re, { log: false })
        .click({ log: false })
    })
  })
  log.end()
})

// works only for SelectContactIdNameTitle
Cypress.Commands.add('selectContactAndTitle', (displayName, titleForProject, numberInForm = 0) => {
  const log = Cypress.log({
    name: 'selectContactAndTitle',
    displayName: 'SELECT 2',
    message: [`SelectContactIdNameTitle: ${displayName}, ${titleForProject}`],
    autoEnd: false
  })
  const re1 = new RegExp(`^${displayName}$`) // exact match
  const re2 = new RegExp(`^${titleForProject}$`) // exact match
  log.snapshot('before')
  cy.get(`#contactId${numberInForm}`, { log: false })
    .within({ log: false }, () => {
      cy.get('input')
        .click({ force: true, log: false })
        .type(displayName)
        .get('.fast-option', { log: false })
        .contains(re1, { log: false })
        .click({ log: false })
    })
  cy.get(`#contactTitle${numberInForm}`, { log: false })
    .within({ log: false }, () => {
      cy.get('input')
        .click({ force: true, log: false })
        .type(titleForProject)
        .get('.fast-option', { log: false })
        .contains(re2, { log: false })
        .click({ log: false })
    })
  log.snapshot('after')
  log.end()
})
// works only for SelectProjectIdTitle
Cypress.Commands.add('selectProjectAndTitle', (projectTitle, titleForProject, numberInForm = 0) => {
  const log = Cypress.log({
    name: 'selectProjectAndTitle',
    displayName: 'SELECT 2',
    message: [`SelectProjectIdTitle: ${projectTitle}, ${titleForProject}`],
    autoEnd: false
  })
  const re1 = new RegExp(`^${projectTitle}$`) // exact match
  const re2 = new RegExp(`^${titleForProject}$`) // exact match
  log.snapshot('before')
  cy.get(`#projectId${numberInForm}`, { log: false })
    .within({ log: false }, () => {
      cy.get('input')
        .click({ force: true, log: false })
        .type(projectTitle)
        .get('.fast-option', { log: false })
        .contains(re1, { log: false })
        .click({ force: true, log: false })
    })
  cy.get(`#titleForProject${numberInForm}`, { log: false })
    .within({ log: false }, () => {
      cy.get('input')
        .click({ force: true, log: false })
        .type(titleForProject)
        .get('.fast-option', { log: false })
        .contains(re2, { log: false })
        .click({ force: true, log: false })
    })
  log.snapshot('after')
  log.end()
})

Cypress.Commands.add('waitForContactOptions', () => {
  cy.get('[id^=data-cy-select-contact-id]', { log: false })
})

Cypress.Commands.add('waitForOfficeOptions', () => {
  cy.get('[id^=data-cy-my-select]', { log: false })
})

Cypress.Commands.add('waitForPastProjectOptions', () => {
  cy.get('[id^=data-cy-select-pastproject-id]', { log: false })
})

Cypress.Commands.add('waitForProjectOptions', () => {
  cy.get('[id^=data-cy-select-project-id]', { log: false })
})
