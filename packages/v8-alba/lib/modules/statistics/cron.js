import { CronJob } from 'cron';
import Projects from '../projects/collection.js';

const addJob = function () {
  console.log('Before job instantiation');
  const job = new CronJob({
    cronTime: '0 */1 * * * *',
    onTick: Meteor.bindEnvironment(function() {
      const d = new Date();
      console.log('Every minute:', d);
      const casting = Projects.find({
        status: "Casting"
      }).count();
      const episodicsCasting = Projects.find({
        projectType: { $in: [ "TV One Hour", "TV 1/2 Hour" ] },
        status: "Casting"
      }).count();
      console.log('Episodics casting:', episodicsCasting);
      const pilotsCasting = Projects.find({
        projectType: { $in: [ "Pilot One Hour", "Pilot 1/2 Hour", "Pilot Presentation" ] },
        status: "Casting"
      }).count();
      console.log('Pilots casting:', pilotsCasting);
      const featuresCasting = Projects.find({
        projectType: { $in: [ "Feature Film", "Feature Film (LB)", "Feature Film (MLB)", "Feature Film (ULB)" ] },
        status: "Casting"
      }).count();
      console.log('Features casting:', featuresCasting);
      console.log('Others casting:', casting - (featuresCasting + pilotsCasting + episodicsCasting));
    })
  });
  console.log('After job instantiation');
  job.start();
  console.log('Is job running?', job.running);

//   SyncedCron.add({
//     name: 'checkScheduledPosts',
//     schedule(parser) {
//       return parser.text('every 2 hours');
//     },
//     job() {
//       // fetch all posts tagged as future
//       const scheduledPosts = Posts.find({isFuture: true}, {fields: {_id: 1, status: 1, postedAt: 1, userId: 1, title: 1}}).fetch();
//
//       // filter the scheduled posts to retrieve only the one that should update, considering their schedule
//       const postsToUpdate = scheduledPosts.filter(post => post.postedAt <= new Date());
//
//       // update posts found
//       if (!_.isEmpty(postsToUpdate)) {
//         const postsIds = _.pluck(postsToUpdate, '_id');
//         Posts.update({_id: {$in: postsIds}}, {$set: {isFuture: false}}, {multi: true});
//
//         // log the action
//         console.log('// Scheduled posts approved:', postsIds); // eslint-disable-line
//       }
//     }
//   });
};

Meteor.startup(function () {
  addJob();
});
