/* Seed the database with some dummy content. */

import { Promise } from 'meteor/promise'
import Users from 'meteor/vulcan:users'
import { newMutation } from 'meteor/vulcan:core'
import Contacts from '../modules/contacts/collection.js'
import Offices from '../modules/offices/collection.js'
import Patches from '../modules/patches/collection.js'
import Projects from '../modules/projects/collection.js'
import PastProjects from '../modules/past-projects/collection.js'
import Statistics from '../modules/statistics/collection.js'

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
  console.log('// inserting dummy users…')
  return Promise.all([
    createUser('Bruce', 'dummyuser1@telescopeapp.org'),
    createUser('Julia', 'dummyuser3@telescopeapp.org')
  ])
}

// eslint-disable-next-line no-undef
Vulcan.removeGettingStartedContent = () => {
  Users.remove({ 'profile.isDummy': true })
  // eslint-disable-next-line no-console
  console.log('// Getting started content removed')
}

// eslint-disable-next-line no-undef
Meteor.startup(() => {
  if (Users.find().fetch().length === 0) {
    Promise.await(createDummyUsers())
  }
  const currentUser = Users.findOne() // just get the first user available
  if (Contacts.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy contacts')
    import('./generated/contacts.js').then(({ contacts }) => {
      Promise.awaitAll(contacts.map(document => newMutation({
        action: 'contacts.new',
        collection: Contacts,
        document,
        currentUser,
        validate: false
      })))
    })
  }
  if (Offices.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy offices')
    import('./generated/offices.js').then(({ offices }) => {
      Promise.awaitAll(offices.map(document => newMutation({
        action: 'offices.new',
        collection: Offices,
        document,
        currentUser,
        validate: false
      })))
    })
  }
  if (Projects.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy projects')
    import('./generated/projects.js').then(({ projects }) => {
      Promise.awaitAll(projects.map(document => newMutation({
        action: 'projects.new',
        collection: Projects,
        document,
        currentUser,
        validate: false
      })))
    })
  }
  if (PastProjects.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy past-projects')
    import('./generated/pastprojects.js').then(({ pastprojects }) => {
      Promise.awaitAll(pastprojects.map(document => newMutation({
        action: 'past-projects.create',
        collection: PastProjects,
        document,
        currentUser,
        validate: false
      })))
    })
  }
  if (Statistics.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy statistics')
    import('./seeds/_statistics.js').then(({ statistics }) => {
      Promise.await(Statistics.insert(statistics))
    })
  }
  if (Patches.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy patches')
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
