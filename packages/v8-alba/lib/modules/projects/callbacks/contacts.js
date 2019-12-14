import { Connectors } from 'meteor/vulcan:core'
import Contacts from '../../contacts/collection.js'
import _ from 'lodash'
// import { PAST_PROJECT_STATUSES_ARRAY } from '../../constants.js'
import { isEmptyValue } from '../../helpers.js'

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
  titleForProject: projectContact.contactTitle
}
*/

// export function ProjectEditUpdateContacts (document, properties) {
//   const project = document
//   if (!project.contacts) {
//     return
//   }
//
//   project.contacts.forEach(projectContact => {
//     const contact = Contacts.findOne(projectContact.contactId) // TODO: error handling
//     const newProject = {
//       projectId: project._id,
//       projectTitle: project.projectTitle,
//       titleForProject: projectContact.contactTitle
//     }
//     var newPastProjects = []
//     var newProjects = []
//
//     if (_.includes(PAST_PROJECT_STATUSES_ARRAY, project.status)) {
//       // project is becoming a past-project
//       // case 1: there are no pastProjects on the contact and contact.pastProjects is undefined
//       if (!contact.pastProjects) {
//         newPastProjects = [newProject]
//       } else {
//         const i = _.findIndex(contact.pastProjects, { projectId: project._id })
//         newPastProjects = contact.pastProjects
//         if (i < 0) {
//           // case 2: this past-project is not on this contact but other past-projects are and we're adding this past-project
//           newPastProjects.push(newProject)
//         } else {
//           // case 3: this past-project is on this contact and we're updating the info
//           newPastProjects[i] = newProject
//         }
//       }
//       const sortedPastProjects = _.sortBy(newPastProjects, ['projectTitle'])
//       Connectors.update(Contacts, contact._id, {
//         $set: {
//           pastProjects: sortedPastProjects,
//           updatedAt: new Date()
//         }
//       })
//
//       // also remove the project from contact.projects
//       if (!isEmptyValue(contact.projects)) {
//         newProjects = contact.projects
//         const i = _.findIndex(contact.projects, { projectId: project._id })
//         if (i > -1) {
//           newProjects.splice(i, 1)
//           Connectors.update(Contacts, contact._id, {
//             $set: {
//               projects: newProjects,
//               updatedAt: new Date()
//             }
//           })
//         }
//       }
//     } else {
//       // project remains a project
//       // case 1: there are no projects on the contact and contact.projects is undefined
//       if (isEmptyValue(contact.projects)) {
//         newProjects = [newProject]
//       } else {
//         const i = _.findIndex(contact.projects, { projectId: project._id })
//         newProjects = contact.projects
//         if (i < 0) {
//           // case 2: this project is not on this contact but other projects are and we're adding this project
//           newProjects.push(newProject)
//         } else {
//           // case 3: this project is on this contact and we're updating the info
//           newProjects[i] = newProject
//         }
//       }
//       Connectors.update(Contacts, contact._id, {
//         $set: {
//           projects: newProjects,
//           updatedAt: new Date()
//         }
//       })
//     }
//   })
// }


export function ProjectEditUpdateContacts (data, { document, originalDocument }) {
  // [a] if the two `contacts` arrays are equal, do nothing
  // [b] else for deleted contacts in oldProject but not newProject, remove project from those contacts
  // [c] and for added contacts in newProject but not oldProject, add project to those contacts

  // TODO: what happens when Project becomes PastProject ???

  const project = document
  let contactsToRemoveThisProjectFrom = null
  let contactsToAddThisProjectTo = null

  if (!originalDocument) { // newly created project --> [c] add project to its contacts, if any
    if (!isEmptyValue(project.contacts)) {
      contactsToAddThisProjectTo = project.contacts
    } else {
      return
    }
  } else {
    const newProject = document
    const oldProject = originalDocument
    contactsToAddThisProjectTo = _.differenceWith(newProject.contacts, oldProject.contacts, _.isEqual)
    contactsToRemoveThisProjectFrom = _.differenceWith(oldProject.contacts, newProject.contacts, _.isEqual)
    console.group('ProjectEditUpdateContacts:')
    console.info('contactsToRemoveThisProjectFrom:', contactsToRemoveThisProjectFrom)
    console.info('contactsToAddThisProjectTo:', contactsToAddThisProjectTo)
    console.groupEnd()
  }
  // [b]
  if (contactsToRemoveThisProjectFrom) {
    contactsToRemoveThisProjectFrom.forEach(deletedContact => {
      const oldContact = Contacts.findOne(deletedContact.contactId)
      let oldContactProjects = oldContact && oldContact.projects

      _.remove(oldContactProjects, function (p) {
        return p.projectId === document._id
      })

      if (isEmptyValue(oldContactProjects)) {
        Connectors.update(Contacts, oldContact._id, {
          $unset: {
            projects: 1
          }
        })
      } else {
        Connectors.update(Contacts, oldContact._id, {
          $set: {
            projects: oldContactProjects,
            updatedAt: new Date()
          }
        })
      }
    })
  }
  //
  //
  //     // case 1: no projects on contact, do nothing
  //     if (contact.projects) {
  //       let updatedProjects = contact.projects
  //       _.remove(updatedProjects, function (p) {
  //         return p.projectId === document._id
  //       })
  //       // case 2: it wasn't on the list of projects, do nothing
  //       if (_.isEqual(contact.projects, updatedProjects)) {
  //         return
  //       }
  //       // case 3: remove it
  //       Connectors.update(Contacts, contact._id, {
  //         $set: {
  //           projects: updatedProjects,
  //           updatedAt: new Date()
  //         }
  //       })
  //     }
  //   })
  // }
  // [c]
  if (contactsToAddThisProjectTo) {
    contactsToAddThisProjectTo.forEach(addedContact => {
      const contact = Contacts.findOne(addedContact.contactId)
      const updatedProject = {
        projectId: project._id,
        projectTitle: project.projectTitle,
        titleForProject: addedContact.contactTitle
      }
      let updatedProjects = []
      // case 1: nothing there
      if (isEmptyValue(contact.projects)) {
        updatedProjects = [updatedProject]
      } else {
        updatedProjects = contact.projects
        const i = _.findIndex(contact.projects, { projectId: project._id })
        if (i < 0) {
          // case 2: add to it
          updatedProjects.push(updatedProject)
        } else {
          // case 3: already there
          return
        }
      }
      Connectors.update(Contacts, contact._id, {
        $set: {
          projects: updatedProjects,
          updatedAt: new Date()
        }
      })
    })
  }
}
