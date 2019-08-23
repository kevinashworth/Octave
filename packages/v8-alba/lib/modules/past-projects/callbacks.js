import { addCallback, Connectors, createMutator, deleteMutator, updateMutator } from 'meteor/vulcan:core'
import Contacts from '../contacts/collection.js'
import Offices from '../offices/collection.js'
import Projects from '../projects/collection.js'
import PastProjects from './collection.js'
import Statistics from '../statistics/collection.js'
import { isEmptyValue } from '../helpers.js'
import { logger } from '../logger.js'
import { ACTIVE_PROJECT_STATUSES_ARRAY } from '../constants.js'
import _ from 'lodash'
import moment from 'moment'

/*
When updating a contact on a pastproject, also update that contact with the pastproject.
I get confused, so here's a description:

Where i represents the contact(s) we're adding to our pastproject,
pastproject.contacts[i] has { contactId, contactName, contactTitle }

But we actually get all contacts, not just i, the new ones.

So for each of the pastproject.contacts we update contact.pastprojects of the Contact with _id === contactId with
{
  projectId: project._id,
  projectTitle: project.projectTitle,
  titleForProject: projectContact.contactTitle
}

TODO: For some reason, the contact's `updatedAt` field doesn't get a `moment().format("YYYY-MM-DD HH:mm:ss")` `onEdit`
*/
function PastProjectEditUpdateContacts (data, { document }) {
  const project = document
  if (!project.contacts) {
    return
  }

  project.contacts.forEach(projectContact => {
    const contact = Contacts.findOne(projectContact.contactId) // TODO: error handling
    const newProject = {
      projectId: project._id,
      projectTitle: project.projectTitle,
      titleForProject: projectContact.contactTitle
    }

    if (_.includes(ACTIVE_PROJECT_STATUSES_ARRAY, project.status)) {
      // past-project is becoming a project
      var newProjects = []
      // case 1: there are no contacts on the project and project.contacts is undefined
      if (!contact.projects) {
        newProjects = [newProject]
      } else {
        const i = _.findIndex(contact.projects, { projectId: project._id })
        newProjects = contact.projects
        if (i < 0) {
          // case 2: this contact is not on this project but other contacts are and we're adding this contact
          newProjects.push(newProject)
        } else {
          // case 3: this contact is on this project and we're updating the info
          newProjects[i] = newProject
        }
      }
      const sortedProjects = _.sortBy(newProjects, ['projectTitle'])
      Connectors.update(Contacts, contact._id, { $set: {
        projects: sortedProjects,
        updatedAt: new Date()
      } })

      // also remove the past-project from contact.pastProjects
      if (!isEmptyValue(contact.pastProjects)) {
        var newPastProjects = contact.pastProjects
        const i = _.findIndex(contact.pastProjects, { projectId: project._id })
        if (i > -1) {
          newProjects.splice(i, 1)
          Connectors.update(Contacts, contact._id, { $set: {
            pastProjects: newPastProjects,
            updatedAt: new Date()
          } })
        }
      }
    } else {
      // past-project remains a past-project
      newPastProjects = []
      // case 1: there are no past-projects on the contact and contact.pastProjects is undefined
      if (isEmptyValue(contact.pastProjects)) {
        newPastProjects = [newProject]
      } else {
        const i = _.findIndex(contact.pastProjects, { projectId: project._id })
        newPastProjects = contact.pastProjects
        if (i < 0) {
          // case 2: this past-project is not on this contact but other past-projects are and we're adding this past-project
          newPastProjects.push(newProject)
        } else {
          // case 3: this past-project is on this contact and we're updating the info
          newPastProjects[i] = newProject
        }
      }
      Connectors.update(Contacts, contact._id, { $set: {
        pastProjects: newPastProjects,
        updatedAt: new Date()
      } })
    }
  })
}

/*
When updating a office on a pastProject, also update that office with the pastProject.
I get confused, so here's a description:

Where i represents the office(s) we're adding to our pastProject,
pastProject.offices[i] has { officeId, officeName }

But we actually get all offices, not just i, the new ones.

So for each of the pastProject.offices we update office.pastProjects of the Office with _id === officeId with
{
  projectId: pastProject._id
}
*/
/* This is for Past Projects created from scratch, not Projects turned into Past Projects
 so disabling this until becomes useful */
// function PastProjectCreateUpdateOfficeAfter (data, { document }) {
//   const pastProject = document
//   if (!pastProject.castingOfficeId) {
//     return
//   }
//
//   const office = Offices.findOne(pastProject.castingOfficeId) // TODO: error handling
//   const newPastProject = {
//     projectId: pastProject._id
//   }
//   let updatedPastProjects = []
//
//   // case 1: there are no pastProjects on the office and office.pastProjects is undefined
//   if (!office.pastProjects) {
//     updatedPastProjects = [newPastProject]
//   } else {
//     const i = _.findIndex(office.pastProjects, { projectId: pastProject._id })
//     if (i < 0) {
//       // case 2: this pastProject is not on this office but other pastProjects are and we're adding this pastProject
//       updatedPastProjects = office.pastProjects
//       updatedPastProjects.push(newPastProject)
//     } else {
//       // case 3: this pastProject is on this office and we're updating the info
//       updatedPastProjects[i] = newPastProject
//     }
//   }
//   Connectors.update(Offices, office._id, { $set: { pastProjects: updatedPastProjects } })
// }

function PastProjectEditUpdateOfficeBefore (data, { currentUser, document, oldDocument }) {
  const oldOffice = oldDocument.castingOfficeId
  const newOffice = document.castingOfficeId
  let removing = false
  if (oldOffice && !newOffice) {
    // this is an office getting removed from the project, so we also need to remove the project from that office
    removing = true
  }
  let replacing = false
  if (newOffice && oldOffice && oldOffice !== newOffice) {
    removing = false
    // this is one office replacing another on the project
    replacing = true
  }
  let itmightnotbethereforsomereason = false
  if (newOffice === oldOffice) {
    logger.info('itmightnotbethereforsomereason')
    itmightnotbethereforsomereason = true
  }
  if (removing || replacing || itmightnotbethereforsomereason) {
    const office = Offices.findOne(oldOffice) // TODO: error handling
    let pastProjects = office.pastProjects
    if (!isEmptyValue(pastProjects)) {
      if (itmightnotbethereforsomereason) {
        if (_.indexOf(pastProjects, { projectId: document._id }) < 0) {
          replacing = true
        }
      }
      _.remove(pastProjects, function (p) {
        return p._id === document._id
      })
      if (replacing) {
        pastProjects.push({ projectId: document._id })
      }
      Connectors.update(Offices, office._id, { $set: {
        pastProjects: pastProjects,
        updatedAt: new Date()
      } })
    }
  }
}

/* When adding a past-project, update statistics */
function PastProjectCreateUpdateStatisticsAsync ({ currentUser, document }) {
  const project = document
  const theStats = Statistics.findOne()
  let newStats = {}
  newStats.episodics = theStats.episodics
  newStats.features = theStats.features
  newStats.pilots = theStats.pilots
  newStats.others = theStats.others

  switch (project.projectType) {
    case 'TV One Hour':
    case 'TV 1/2 Hour':
    case 'TV Animation':
      const episodicsCasting = Projects.find({
        projectType: { $in: [ 'TV One Hour', 'TV 1/2 Hour', 'TV Animation' ] },
        status: 'Casting'
      }).count()
      newStats.episodics.push({ date: moment().format('YYYY-MM-DD HH:mm:ss'), quantity: episodicsCasting })
      break
    case 'Feature Film':
    case 'Feature Film (LB)':
    case 'Feature Film (MLB)':
    case 'Feature Film (ULB)':
      const featuresCasting = Projects.find({
        projectType: { $in: [ 'Feature Film', 'Feature Film (LB)', 'Feature Film (MLB)', 'Feature Film (ULB)' ] },
        status: 'Casting'
      }).count()
      newStats.features.push({ date: moment().format('YYYY-MM-DD HH:mm:ss'), quantity: featuresCasting })
      break
    case 'Pilot One Hour':
    case 'Pilot 1/2 Hour':
    case 'Pilot Presentation':
      const pilotsCasting = Projects.find({
        projectType: { $in: [ 'Pilot One Hour', 'Pilot 1/2 Hour', 'Pilot Presentation' ] },
        status: 'Casting'
      }).count()
      newStats.pilots.push({ date: moment().format('YYYY-MM-DD HH:mm:ss'), quantity: pilotsCasting })
      break
    case 'Short Film':
    case 'TV Daytime':
    case 'TV Mini-Series':
    case 'TV Movie':
    case 'TV Telefilm':
    case 'TV Talk/Variety':
    case 'TV Sketch/Improv':
    case 'New Media':
      const othersCasting = Projects.find({
        projectType: { $in: [ 'Short Film', 'TV Daytime', 'TV Mini-Series', 'TV Movie', 'TV Telefilm', 'TV Talk/Variety', 'TV Sketch/Improv', 'New Media' ] },
        status: 'Casting'
      }).count()
      newStats.others.push({ date: moment().format('YYYY-MM-DD HH:mm:ss'), quantity: othersCasting })
      break
    // default:
  }
  Promise.await(updateMutator({
    action: 'statistic.update',
    documentId: theStats._id,
    collection: Statistics,
    set: newStats,
    currentUser,
    validate: false
  }))
}

async function PastProjectUpdateStatusAsync ({ currentUser, document, oldDocument }) {
  // if the new status is now an active project, create a new project then remove this past-project
  const newStatusIsActive = _.includes(ACTIVE_PROJECT_STATUSES_ARRAY, document.status)

  const createNewProject = async () => {
    try {
      return await createMutator({
        collection: Projects,
        document,
        currentUser,
        validate: false
      })
    } catch (e) {
      logger.groupCollapsed('Error in createNewProject:')
      logger.error(e)
      logger.groupEnd
    }
  }

  const deletePastProject = async () => {
    try {
      return await deleteMutator({
        collection: PastProjects,
        documentId: document._id,
        currentUser,
        validate: false
      })
    } catch (err) {
      logger.error('error in deletePastProject:', err)
    }
  }

  if (newStatusIsActive) {
    const newProject = (await createNewProject()).data

    // if the new project is created and matches (TODO: matches what, exactly?), delete current
    if (newProject.projectTitle === document.projectTitle) {
      await deletePastProject()
    }

    if (document.castingOfficeId) {
      let pastProjects = []
      let projects = []
      const office = Offices.findOne(document.castingOfficeId)
      if (office.pastProjects && office.pastProjects.length) {
        pastProjects = office.pastProjects
        _.remove(pastProjects, function (p) {
          return p._id === document._id
        })
      }
      if (office.projects && office.projects.length) {
        projects = office.projects
      }
      projects.push({ projectId: newProject._id })
      Connectors.update(Offices, document.castingOfficeId, { $set: {
        pastProjects,
        projects,
        updatedAt: new Date()
      } })
    }
  }
}

addCallback('pastproject.create.after', PastProjectEditUpdateContacts)
// addCallback('pastproject.create.after', PastProjectCreateUpdateOfficeAfter)
addCallback('pastproject.create.async', PastProjectCreateUpdateStatisticsAsync)

addCallback('pastproject.update.before', PastProjectEditUpdateOfficeBefore)
addCallback('pastproject.update.after', PastProjectEditUpdateContacts)
addCallback('pastproject.update.async', PastProjectUpdateStatusAsync)
