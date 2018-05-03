// see https://guide.meteor.com/collections.html#migrations
import { Migrations } from 'meteor/percolate:migrations';

Migrations.add({
  version: 1,
  name: 'just a test',
  up() {
    // eslint-disable-next-line no-console
    console.log('Up! Inside migrations.');
    // Projects.find({addresses: {$exists: false}}).forEach(project => {
    //   Projects.update(addresses[0], {$set: {project.address}});
    // });
  },
  down() {
    // eslint-disable-next-line no-console
    console.log('Down! Inside migrations.');
    // Projects.update({}, {$unset: {addresses: true}}, {multi: true});
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
});
