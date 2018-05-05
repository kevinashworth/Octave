// see https://guide.meteor.com/collections.html#migrations
import { Migrations } from 'meteor/percolate:migrations';
import Projects from '../modules/projects/collection.js';

Migrations.add({
  version: 1,
  name: 'address -> addresses',
  up() {
    Projects.find({addresses: {$exists: false}}).forEach(project => {
      if (project.address) {
        Projects.update(project._id,
          {
            $addToSet: {addresses: project.address},
            $unset: {address: 1, project_id: 1}
          });
      }
    });
  },
  down() {
    Projects.find({address: {$exists: false}}).forEach(project => {
      if (project.addresses && project.addresses[0]) {
        Projects.update(project._id,
          {
            $set: {address: project.addresses[0]},
            $unset: {addresses: 1}
          });
      }
    });
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('1');
});
