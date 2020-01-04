/* Seed the database with some dummy content. */

import { Promise } from 'meteor/promise'
import Users from 'meteor/vulcan:users'
import { newMutation } from 'meteor/vulcan:core'
// import AlgoliaLog from '../modules/algolia-log/collection.js'
import Contacts from '../modules/contacts/collection.js'
import Histories from '../modules/history/collection.js'
import Offices from '../modules/offices/collection.js'
import Projects from '../modules/projects/collection.js'
import PastProjects from '../modules/past-projects/collection.js'
import Statistics from '../modules/statistics/collection.js'
import seedContacts from './seeds/_contacts3.js'
import seedProjects from './seeds/_projects.js'
import seedPastProjects from './seeds/_3past-projects.js'
import seedOffices from './seeds/_offices2.js'
import seedStatistics from './seeds/_statistics.js'

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
    createUser('Arnold', 'dummyuser2@telescopeapp.org'),
    createUser('Julia', 'dummyuser3@telescopeapp.org')
  ])
}

const seedHistory = {
	_id: 'v4vAkMJ2EyqMmFKGw',
	changes: [
    {
			date: new Date('2020-01-03T21:08:58.333Z').toUTCString(),
			diff: { op: 'replace', path: '/addresses/0/street2', value: 'Stage 4, 5th Floor' }
		}
	],
	collectionName: 'Offices'
}


// eslint-disable-next-line no-undef
Vulcan.removeGettingStartedContent = () => {
  Users.remove({ 'profile.isDummy': true })
  // eslint-disable-next-line no-console
  console.log('// Getting started content removed')
}

Meteor.startup(() => {
  if (Users.find().fetch().length === 0) {
    Promise.await(createDummyUsers())
  }
  const currentUser = Users.findOne() // just get the first user available
  if (Contacts.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy contacts')
    Promise.awaitAll(seedContacts.map(document => newMutation({
      action: 'contacts.new',
      collection: Contacts,
      document,
      currentUser,
      validate: false
    })))
  }
  if (Projects.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy projects')
    Promise.awaitAll(seedProjects.map(document => newMutation({
      action: 'projects.new',
      collection: Projects,
      document,
      currentUser,
      validate: false
    })))
  }
  if (PastProjects.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy past-projects')
    Promise.awaitAll(seedPastProjects.map(document => newMutation({
      action: 'past-projects.create',
      collection: PastProjects,
      document,
      currentUser,
      validate: false
    })))
  }
  if (Offices.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy offices')
    Promise.awaitAll(seedOffices.map(document => newMutation({
      action: 'offices.new',
      collection: Offices,
      document,
      currentUser,
      validate: false
    })))
  }
  if (Statistics.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy statistics')
    Promise.await(newMutation({
      action: 'statistics.new',
      collection: Statistics,
      document: seedStatistics,
      currentUser,
      validate: false
    }))
  }
  if (Histories.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy histories')
    Promise.await(newMutation({
      action: 'histories.new',
      collection: Histories,
      document: seedHistory,
      currentUser,
      validate: false
    }))
  }
  // if (AlgoliaLog.find().fetch().length === 0) {
  //   // eslint-disable-next-line no-console
  //   console.log('// creating dummy algolia')
  //   Promise.await(newMutation({
  //     action: 'algolia.new',
  //     collection: AlgoliaLog,
  //     document: seedAlgoliaLog,
  //     currentUser,
  //     validate: false
  //   }))
  // }
})
