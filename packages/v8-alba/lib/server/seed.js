/*

Seed the database with some dummy content.

*/

import { Promise } from 'meteor/promise';
import Users from 'meteor/vulcan:users';
import { newMutation } from 'meteor/vulcan:core';
import Contacts from '../modules/contacts/collection.js';

const seedData = [
  {
  "displayName": "Nicole Abellera Hallman",
  "street1": "1750 Ocean Park Blvd.  Ste. 208",
  "city": "Santa Monica",
  "state": "RI",
  "zip": "00987"
  },
  {
  "displayName": "Faith Abraham",
  "street1": "1756 22nd St.",
  "city": "Santa Monica",
  "state": "CA",
  "zip": "90404"
  },
  {
  "displayName": "Faith Abraham",
  "street1": "2323 Beverly Blvd.",
  "city": "Los Angeles",
  "state": "CA",
  "zip": "90057"
  },
  {
  "displayName": "Micky Adams",
  "street1": "5225 Wilshire Blvd.  Ste. 415",
  "city": "Los Angeles",
  "state": "CA",
  "zip": "90036"
  },
  {
  "displayName": "Jonathan Aldana",
  "street1": "4024 Radford Ave.",
  "street2": "Editorial Bldg. 2  Room 5",
  "city": "Studio City",
  "state": "CA",
  "zip": "91604"
  },
  {
  "displayName": "Alexis Allen",
  "street1": "1149 N. Gower St.  Ste. 106B",
  "city": "Los Angeles",
  "state": "CA",
  "zip": "90038"
  },
  {
  "displayName": "Jill Anthony Thomas",
  "street1": "100 Universal City Plaza",
  "street2": "Bldg. 9128  Ste. A",
  "city": "Universal City",
  "state": "CA",
  "zip": "91608"
  },
];

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
    Promise.awaitAll(seedData.map(document => newMutation({
      action: 'contacts.new',
      collection: Contacts,
      document,
      currentUser,
      validate: false,
    })));
  }
});
