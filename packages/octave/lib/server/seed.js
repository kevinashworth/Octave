import { Promise } from 'meteor/promise'
import { createMutator, getSetting } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
// import log from 'loglevel'
import { logger } from './logger.js'
import Patches from '../modules/patches/collection.js'
import Statistics from '../modules/statistics/collection.js'
import { populateAlgoliaMockaroo } from './algolia/algolia-initialize.js'

const createUser = async (username, email) => {
  const user = {
    username,
    email,
    isDummy: true
  }
  return createMutator({
    collection: Users,
    document: user,
    validate: false
  })
}

const createDummyUsers = async () => {
  // eslint-disable-next-line no-console
  logger.info('// inserting dummy users…')
  return Promise.all([
    createUser('Andoria', 'dummyuser1@federation.org'),
    createUser('Coridan', 'dummyuser2@federation.org')
  ])
}

const createUser2 = async (username, password) => {
  const user = {
    username,
    password,
    groups: ['participants'],
    isDummy: true
  }
  return createMutator({
    collection: Users,
    document: user,
    validate: false
  })
}

const createTestUser = async () => {
  console.log('creating Test User')
  return Promise.all([
    createUser2('Test User', 'Test Password')
  ])
}

Vulcan.removeGettingStartedContent = () => {
  Users.remove({ 'profile.isDummy': true })
  // eslint-disable-next-line no-console
  logger.info('// Getting started content removed')
}

const importAndCreate = (collectionName) => {
  const currentUser = Users.findOne() // just get the first user available
  const collection = collectionName.toLowerCase()
  const filename = `./seeds/generated/${collection}.js`
  logger.info('// creating generated', collection)
  import(filename)
    .then((module) => {
      const objects = module[collection]
      Promise.awaitAll(objects.forEach((document) => {
        document.createdAt = new Date(document.createdAt)
        if (document.updatedAt) {
          document.updatedAt = new Date(document.updatedAt)
        }
        createMutator({
          collection: collectionName,
          document,
          currentUser,
          validate: false
        })
      }))
    })
}

const importGenerated = async () => {
  logger.info('about to import 3 generated')
  const [{ contacts }, { offices }, { projects }] =
    await Promise.all([
      import('./seeds/generated/contacts.js'),
      import('./seeds/generated/offices.js'),
      import('./seeds/generated/projects.js')
    ])
  return { contacts, offices, projects }
}

Meteor.startup(() => {
  const numUsers = Users.find().fetch().length
  if (numUsers === 0) {
    Promise.await(createDummyUsers())
  } else {
    logger.info(`there are ${numUsers} users`)
  }
  const currentUser = Users.findOne() // just get the first user available

  if (getSetting('mockaroo.seedDatabase')) {
    importAndCreate('Contacts')
    importAndCreate('Offices')
    importAndCreate('Projects')
    importAndCreate('PastProjects')
  }

  if (getSetting('mockaroo.initializeAlgolia')) {
    importGenerated()
      .then(({ contacts, offices, projects }) => {
        logger.info('about to populate Algolia with 3 generated')
        populateAlgoliaMockaroo(contacts, offices, projects)
      })
  }

  if (Statistics.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    logger.info('// creating dummy statistics')
    import('./seeds/_statistics.js').then(({ statistics }) => {
      Promise.await(createMutator({
        collection: Statistics,
        document: statistics,
        currentUser,
        validate: false
      }))
    })
  }
  if (Patches.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    logger.info('// creating dummy patches')
    import('./seeds/_patch.js').then(({ seedPatch }) => {
      Promise.await(createMutator({
        collection: Patches,
        document: seedPatch,
        currentUser,
        validate: false
      }))
    })
  }
})

module.exports = {
  createTestUser
}
