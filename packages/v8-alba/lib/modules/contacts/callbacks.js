import { Connectors, addCallback } from 'meteor/vulcan:core';
import Projects from '../projects/collection.js';
import _ from 'lodash';

function getFullNameFromContact ({firstName, middleName, lastName}) {
  let tempName = "";
  if (firstName) {
    tempName += firstName;
  }
  if (middleName) {
    tempName += (" " + middleName);
  }
  if (lastName) {
    tempName += (" " + lastName);
  }
  if (tempName.length) {
    return tempName;
  } else {
    return "displayName or fullName Unknown";
  }
}

/*
When updating a project on a contact, also update that project with the contact.
I get confused, so here's a description:

  Where i represents the project(s) we're adding to our contact,
  contact.projects[i] has { projectId, projectTitle, titleForProject }

  But we actually get all projects, not just i, the new ones.

  So for each of the contact.projects we update project.contacts of the Project with _id === projectId with
  {
  contactId: contact._id,
  contactName: fullName -- which is getFullNameFromContact(contact),
  contactTitle: project.titleForProject
  }

TODO: For some reason, the project's `updatedAt` field doesn't get a `new Date()` `onEdit`
*/
function ContactEditUpdateProjects (contact) {
  if (!contact.projects) {
    return;
  }
  const fullName = getFullNameFromContact(contact);

  contact.projects.forEach(contactProject => {
    const project = Projects.findOne(contactProject.projectId); // TODO: error handling
    const newContact = {
      contactId: contact._id,
      contactName: fullName,
      contactTitle: contactProject.titleForProject
    };
    let newContacts = [];

    // case 1: there are no contacts on the project and project.contacts is undefined
    if (!project.contacts) {
      newContacts = [newContact];
    } else {
      const i = _.findIndex(project.contacts, {contactId: contact._id});
      newContacts = project.contacts;
      if (i < 0) {
        // case 2: this contact is not on this project but other contacts are and we're adding this contact
        newContacts.push(newContact);
      } else {
        // case 3: this contact is on this project and we're updating the info
        newContacts[i] = newContact;
      }
    }
    Connectors.update(Projects, project._id, { $set: { contacts: newContacts } });
  })
}

addCallback('contacts.edit.after', ContactEditUpdateProjects);
