import { Connectors, addCallback } from 'meteor/vulcan:core';
import Contacts from '../contacts/collection.js';
import _ from 'lodash';

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

TODO: For some reason, the contact's `updatedAt` field doesn't get a `new Date()` `onEdit`
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

addCallback('projects.edit.after', ProjectEditUpdateContacts);
addCallback('projects.new.after', ProjectEditUpdateContacts);
