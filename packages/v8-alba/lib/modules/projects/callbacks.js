import { addCallback, Connectors, editMutation } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import Contacts from '../contacts/collection.js';
import Projects from './collection.js';
import Statistics from '../statistics/collection.js';
import _ from 'lodash';
import moment from 'moment';

/*
When updating a contact on a project, also update that contact with the project.
I get confused, so here's a description:

  Where i represents the contact(s) we're adding to our project,
  project.contacts[i] has { contactId, contactName, contactTitle }

  But we actually get all contacts, not just i, the new ones.

  So for each of the project.contacts we update contact.projects of the Contact with _id === contactId with
  {
  projectId: project._id,
  projectTitle: project.projectTitle,
  titleForProject: contact.contactTitle
  }

TODO: For some reason, the contact's `updatedAt` field doesn't get a `moment().format("YYYY-MM-DD HH:mm:ss")` `onEdit`
*/
function ProjectEditUpdateContacts (project) {
  if (!project.contacts) {
    return;
  }

  project.contacts.forEach(projectContact => {
    const contact = Contacts.findOne(projectContact.contactId); // TODO: error handling
    const newProject = {
      projectId: project._id,
      projectTitle: project.projectTitle,
      titleForProject: contact.contactTitle
    };
    let newProjects = [];

    // case 1: there are no contacts on the project and project.contacts is undefined
    if (!contact.projects) {
      newProjects = [newProject];
    } else {
      const i = _.findIndex(contact.projects, {projectId: project._id});
      newProjects = contact.projects;
      if (i < 0) {
        // case 2: this contact is not on this project but other contacts are and we're adding this contact
        newProjects.push(newProject);
      } else {
        // case 3: this contact is on this project and we're updating the info
        newProjects[i] = newProject;
      }
    }
    Connectors.update(Contacts, contact._id, { $set: { projects: newProjects } });
  })
}

/* THe non-cron approach: When adding a project, update statistics */
function ProjectNewUpdateStatistics (project) {
  const currentUser = Users.findOne(); // just get the first user available TODO:
  const theStats = Statistics.findOne();
  let newStats = {}
  newStats.episodics = theStats.episodics;
  newStats.features = theStats.features;
  newStats.pilots = theStats.pilots;
  newStats.others = theStats.others;

  switch (project.projectType) {
    case 'TV One Hour':
    case 'TV 1/2 Hour':
      const episodicsCasting = Projects.find({
        projectType: { $in: [ 'TV One Hour', 'TV 1/2 Hour' ] },
        status: 'Casting'
      }).count() + 1;
      newStats.episodics.push({ date: moment().format("YYYY-MM-DD HH:mm:ss"), quantity: episodicsCasting});
      break;
    case 'Feature Film':
    case 'Feature Film (LB)':
    case 'Feature Film (MLB)':
    case 'Feature Film (ULB)':
      const featuresCasting = Projects.find({
        projectType: { $in: [ 'Feature Film', 'Feature Film (LB)', 'Feature Film (MLB)', 'Feature Film (ULB)' ] },
        status: 'Casting'
      }).count() + 1;
      newStats.features.push({ date: moment().format("YYYY-MM-DD HH:mm:ss"), quantity: featuresCasting});
      break;
    case 'Pilot One Hour':
    case 'Pilot 1/2 Hour':
    case 'Pilot Presentation':
      const pilotsCasting = Projects.find({
        projectType: { $in: [ 'Pilot One Hour', 'Pilot 1/2 Hour', 'Pilot Presentation' ] },
        status: 'Casting'
      }).count() + 1;
      newStats.pilots.push({ date: moment().format("YYYY-MM-DD HH:mm:ss"), quantity: pilotsCasting});
      break;
    default:
    // ???
      const othersCasting = Projects.find({
        projectType: { $in: [ 'Short Film', 'TV Daytime', 'TV Mini-Series', 'TV Movie', 'TV Telefilm', 'TV Talk/Variety', 'TV Sketch/Improv', 'New Media' ] },
        status: 'Casting'
      }).count() + 1;
      newStats.others.push({ date: moment().format("YYYY-MM-DD HH:mm:ss"), quantity: othersCasting});
  }
  Promise.await(editMutation({
    action: 'statistic.update',
    documentId: theStats._id,
    collection: Statistics,
    set: newStats,
    currentUser,
    validate: false,
  }));
}

addCallback('project.update.after', ProjectEditUpdateContacts);
addCallback('project.create.after', ProjectEditUpdateContacts);
addCallback('project.create.after', ProjectNewUpdateStatistics);
