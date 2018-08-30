import Users from 'meteor/vulcan:users';
import { editMutation } from 'meteor/vulcan:core';
import Projects from '../modules/projects/collection.js';
import Statistics from '../modules/statistics/collection.js';
import { CronJob } from 'cron';

const currentUser = Users.findOne(); // just get the first user available TODO:
const theStats = Statistics.findOne();
let newStats = {}
newStats.episodics = theStats.episodics;
newStats.features = theStats.features;
newStats.pilots = theStats.pilots;
newStats.others = theStats.others;

const addJob = function () {
  console.log('Before job instantiation');
  const job = new CronJob({
    cronTime: '0 */10 * * * *',
    onTick: Meteor.bindEnvironment(function() {
      const d = new Date();
      console.log('Every tenth minute:', d);
      const casting = Projects.find({
        status: "Casting"
      }).count();
      const episodicsCasting = Projects.find({
        projectType: { $in: [ "TV One Hour", "TV 1/2 Hour" ] },
        status: "Casting"
      }).count();
      newStats.episodics.push({ date: new Date(), quantity: episodicsCasting});
      console.log('Episodics casting:', episodicsCasting);
      const featuresCasting = Projects.find({
        projectType: { $in: [ "Feature Film", "Feature Film (LB)", "Feature Film (MLB)", "Feature Film (ULB)" ] },
        status: "Casting"
      }).count();
      newStats.features.push({ date: new Date(), quantity: featuresCasting});
      console.log('Features casting:', featuresCasting);
      const pilotsCasting = Projects.find({
        projectType: { $in: [ "Pilot One Hour", "Pilot 1/2 Hour", "Pilot Presentation" ] },
        status: "Casting"
      }).count();
      newStats.pilots.push({ date: new Date(), quantity: pilotsCasting});
      console.log('Pilots casting:', pilotsCasting);
      const othersCasting = casting - (featuresCasting + pilotsCasting + episodicsCasting);
      newStats.others.push({ date: new Date(), quantity: othersCasting});
      console.log('Others casting:', othersCasting);
      Promise.await(editMutation({
        action: 'statistics.edit',
        documentId: theStats._id,
        collection: Statistics,
        set: newStats,
        currentUser,
        validate: false,
      }));
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
