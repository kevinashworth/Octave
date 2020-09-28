/* Seed the database with some dummy content. */
import { Promise } from 'meteor/promise'
import Users from 'meteor/vulcan:users'
import { newMutation } from 'meteor/vulcan:core'
import log from 'loglevel'
import Contacts from '../modules/contacts/collection.js'
import Offices from '../modules/offices/collection.js'
import Patches from '../modules/patches/collection.js'
import Projects from '../modules/projects/collection.js'
import PastProjects from '../modules/past-projects/collection.js'
import Statistics from '../modules/statistics/collection.js'
import populateAlgoliaMockaroo from './algolia/algolia-mockaroo.js'

const createUser = async (username, email) => {
  const user = {
    username,
    email,
    isDummy: true
  }
  return newMutation({
    collection: Users,
    document: user,
    validate: false
  })
}

const createDummyUsers = async () => {
  // eslint-disable-next-line no-console
  log.debug('// inserting dummy users…')
  return Promise.all([
    createUser('Bruce', 'dummyuser1@telescopeapp.org'),
    createUser('Julia', 'dummyuser3@telescopeapp.org')
  ])
}

Vulcan.removeGettingStartedContent = () => {
  Users.remove({ 'profile.isDummy': true })
  // eslint-disable-next-line no-console
  log.debug('// Getting started content removed')
}

Meteor.startup(() => {
  if (Users.find().fetch().length === 0) {
    Promise.await(createDummyUsers())
  }
  const currentUser = Users.findOne() // just get the first user available

  let contacts2 = []
  if (Contacts.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    log.debug('// creating dummy contacts')
    import('./seeds/generated/contacts.js').then(({ contacts }) => {
      Promise.awaitAll(contacts.map(document => newMutation({
        action: 'contacts.new',
        collection: Contacts,
        document,
        currentUser,
        validate: false
      })))
      contacts2 = contacts
    })
  }
  let offices2 = []
  if (Offices.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    log.debug('// creating dummy offices')
    import('./seeds/generated/offices.js').then(({ offices }) => {
      Promise.awaitAll(offices.map(document => newMutation({
        action: 'offices.new',
        collection: Offices,
        document,
        currentUser,
        validate: false
      })))
      offices2 = offices
    })
  }
  let projects2 = []
  if (Projects.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    log.debug('// creating dummy projects')
    import('./seeds/generated/projects.js').then(({ projects }) => {
      Promise.awaitAll(projects.map(document => newMutation({
        action: 'projects.new',
        collection: Projects,
        document,
        currentUser,
        validate: false
      })))
      projects2 = projects
    })
  }
  let pastprojects2 = []
  if (PastProjects.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    log.debug('// creating dummy past-projects')
    import('./seeds/generated/pastprojects.js').then(({ pastprojects }) => {
      Promise.awaitAll(pastprojects.map(document => newMutation({
        action: 'past-projects.create',
        collection: PastProjects,
        document,
        currentUser,
        validate: false
      })))
      pastprojects2 = pastprojects
    })
  }
  log.debug('contacts2.length:', contacts2.length)
  log.debug('offices2.length:', offices2.length)
  log.debug('projects2.length:', projects2.length)
  log.debug('pastprojects2.length:', pastprojects2.length)
  if (contacts2.length || offices2.length || projects2.length || pastprojects2.length) {
    log.debug('entering populateAlgoliaMockaroo')
    populateAlgoliaMockaroo(contacts2, offices2, projects2, pastprojects2)
    log.debug('leaving populateAlgoliaMockaroo')
  }

  if (Statistics.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    log.debug('// creating dummy statistics')
    import('./seeds/_statistics.js').then(({ statistics }) => {
      Promise.await(newMutation({
        action: 'statistics.new',
        collection: Statistics,
        document: statistics,
        currentUser,
        validate: false
      }))
    })
  }

  if (Patches.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    log.debug('// creating dummy patches')
    import('./seeds/_patch.js').then(({ seedPatch }) => {
      Promise.await(newMutation({
        action: 'patches.new',
        collection: Patches,
        document: seedPatch,
        currentUser,
        validate: false
      }))
    })
  }
})
