/*

Seed the database with some dummy content.

*/

import { Promise } from 'meteor/promise';
import Users from 'meteor/vulcan:users';
import { newMutation } from 'meteor/vulcan:core';
import Contacts from '../modules/contacts/collection.js';
import Projects from '../modules/projects/collection.js';
import Offices from '../modules/offices/collection.js';
import Statistics from '../modules/statistics/collection.js';
import seedContacts from '../components/contacts/_contacts3.js';
import seedProjects from '../components/projects/_projects.js';
import seedOffices from '../components/offices/_offices2.js';
import seedStatistics from '../modules/statistics/_statistics.js';

const createUser = async (username, email) => {
  const user = {
    username,
    email,
    isDummy: true,
  };
  return newMutation({
    collection: Users,
    document: user,
    validate: false,
  });
};

const createDummyUsers = async () => {
  // eslint-disable-next-line no-console
  console.log('// inserting dummy users…');
  return Promise.all([
    createUser('Bruce', 'dummyuser1@telescopeapp.org'),
    createUser('Arnold', 'dummyuser2@telescopeapp.org'),
    createUser('Julia', 'dummyuser3@telescopeapp.org'),
  ]);
};

// eslint-disable-next-line no-undef
Vulcan.removeGettingStartedContent = () => {
  Users.remove({ 'profile.isDummy': true });
  // eslint-disable-next-line no-console
  console.log('// Getting started content removed');
};

Meteor.startup(() => {
  if (Users.find().fetch().length === 0) {
    Promise.await(createDummyUsers());
  }
  const currentUser = Users.findOne(); // just get the first user available
  if (Contacts.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy contacts');
    Promise.awaitAll(seedContacts.map(document => newMutation({
      action: 'contacts.new',
      collection: Contacts,
      document,
      currentUser,
      validate: false,
    })));
  }
  if (Projects.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy projects');
    Promise.awaitAll(seedProjects.map(document => newMutation({
      action: 'projects.new',
      collection: Projects,
      document,
      currentUser,
      validate: false,
    })));
  }
  if (Offices.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy offices');
    Promise.awaitAll(seedOffices.map(document => newMutation({
      action: 'offices.new',
      collection: Offices,
      document,
      currentUser,
      validate: false,
    })));
  }
  if (Statistics.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy statistics');
    Promise.await(newMutation({
      action: 'statistics.new',
      collection: Statistics,
      document: seedStatistics,
      currentUser,
      validate: false,
    }));
  }
});
