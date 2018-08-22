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

Migrations.add({
  version: 2,
  name: 'updatedAt is empty? set to createdAt',
  up() {
    Projects.find({updatedAt: {$exists: false}}).forEach(project => {
      if (project.createdAt) {
        Projects.update(project._id,
        {
          $set: {updatedAt: project.createdAt}
        })
      }
    })
  },
  down() {
    Projects.find({$where: "this.createdAt.getTime() == this.updatedAt.getTime()"}).forEach(project => {
      if (project.createdAt) {
        Projects.update(project._id,
          {
            $unset: {updatedAt: 1}
          });
        }
    })
  }
})

Migrations.add({
  version: 3,
  name: 'Better projectType naming',
  up() {
    Projects.find({projectType: {$eq: "Ultra Low Budget Film"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "Feature Film (ULB)"}
      })
    });
    Projects.find({projectType: {$eq: "Mod. Low Budget Film"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "Feature Film (MLB)"}
      })
    });
    Projects.find({projectType: {$eq: "Low Budget Film"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "Feature Film (LB)"}
      })
    });
    Projects.find({projectType: {$eq: "One Hour"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "TV One Hour"}
      })
    });
    Projects.find({projectType: {$eq: "1/2 Hour"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "TV 1/2 Hour"}
      })
    });
    Projects.find({projectType: {$eq: "Pilot - One Hour"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "Pilot One Hour"}
      })
    });
    Projects.find({projectType: {$eq: "Pilot - 1/2 Hour"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "Pilot 1/2 Hour"}
      })
    });
    Projects.find({projectType: {$eq: "Daytime"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "TV Daytime"}
      })
    });
    Projects.find({projectType: {$eq: "Mini-Series"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "TV Mini-Series"}
      })
    });
    Projects.find({projectType: {$eq: "Movie for Television"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "TV Movie"}
      })
    });
    Projects.find({projectType: {$eq: "Telefilm"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "TV Telefilm"}
      })
    });
    Projects.find({projectType: {$eq: "Talk/Variety"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "TV Talk/Variety"}
      })
    });
    Projects.find({projectType: {$eq: "Sketch/Improv"}}).forEach(project => {
      Projects.update(project._id,
      {
        $set: {projectType: "TV Sketch/Improv"}
      })
    });
  },
  down() {
    Projects.find({projectType: {$eq: "Feature Film (ULB)"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Ultra Low Budget Film"}
        });
    });
    Projects.find({projectType: {$eq: "Feature Film (MLB)"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Mod. Low Budget Film"}
        });
    });
    Projects.find({projectType: {$eq: "Feature Film (LB)"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Low Budget Film"}
        });
    });
    Projects.find({projectType: {$eq: "TV One Hour"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "One Hour"}
        });
    });
    Projects.find({projectType: {$eq: "TV 1/2 Hour"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "1/2 Hour"}
        });
    });
    Projects.find({projectType: {$eq: "Pilot One Hour"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Pilot - One Hour"}
        });
    });
    Projects.find({projectType: {$eq: "Pilot 1/2 Hour"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Pilot - 1/2 Hour"}
        });
    });
    Projects.find({projectType: {$eq: "TV Daytime"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Daytime"}
        });
    });
    Projects.find({projectType: {$eq: "TV Mini-Series"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Mini-Series"}
        });
    });
    Projects.find({projectType: {$eq: "TV Movie"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Movie for Television"}
        });
    });
    Projects.find({projectType: {$eq: "TV Telefilm"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Telefilm"}
        });
    });
    Projects.find({projectType: {$eq: "TV Talk/Variety"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Talk/Variety"}
        });
    });
    Projects.find({projectType: {$eq: "TV Sketch/Improv"}}).forEach(project => {
      Projects.update(project._id,
        {
          $set: {projectType: "Sketch/Improv"}
        });
    });
  }
})

Meteor.startup(() => {
  Migrations.migrateTo('3');
});
