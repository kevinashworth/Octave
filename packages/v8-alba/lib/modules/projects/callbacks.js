import { addCallback, Connectors, createMutator, deleteMutator, updateMutator } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import Contacts from '../contacts/collection.js'
import Offices from '../offices/collection.js'
import Projects from './collection.js'
import PastProjects from '../past-projects/collection.js'
import Statistics from '../statistics/collection.js'
import { isEmptyValue } from '../helpers.js'
import { PAST_PROJECT_STATUSES_ARRAY } from '../constants.js'
import _ from 'lodash'
import moment from 'moment'

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

TODO: For some reason, the contact's `updatedAt` field doesn't get a `moment().format("YYYY-MM-DD HH:mm:ss")` `onEdit`
*/
function ProjectEditUpdateContacts (project) {
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

    if (_.includes(PAST_PROJECT_STATUSES_ARRAY, project.status)) {
      // project is becoming a past-project
      var newPastProjects = []
      // case 1: there are no pastProjects on the contact and contact.pastProjects is undefined
      if (!contact.pastProjects) {
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
      Connectors.update(Contacts, contact._id, { $set: { pastProjects: newPastProjects } })

      // also remove the project from contact.projects
      if (!isEmptyValue(contact.projects)) {
        var newProjects = contact.projects
        const i = _.findIndex(contact.projects, { projectId: project._id })
        if (i > -1) {
          newProjects.splice(i, 1)
          Connectors.update(Contacts, contact._id, { $set: { projects: newProjects } })
        }
      }
    } else {
      // project remains a project
      newProjects = []
      // case 1: there are no projects on the contact and contact.projects is undefined
      if (isEmptyValue(contact.projects)) {
        newProjects = [newProject]
      } else {
        const i = _.findIndex(contact.projects, { projectId: project._id })
        newProjects = contact.projects
        if (i < 0) {
          // case 2: this project is not on this contact but other projects are and we're adding this project
          newProjects.push(newProject)
        } else {
          // case 3: this project is on this contact and we're updating the info
          newProjects[i] = newProject
        }
      }
      Connectors.update(Contacts, contact._id, { $set: { projects: newProjects } })
    }
  })
}

/*
When updating a office on a project, also update that office with the project.
I get confused, so here's a description:

Where i represents the office(s) we're adding to our project,
project.offices[i] has { officeId, officeName }

But we actually get all offices, not just i, the new ones.

So for each of the project.offices we update office.projects of the Office with _id === officeId with
{
  projectId: project._id,
  projectTitle: project.projectTitle
}
*/
function ProjectEditUpdateOffice (project) {
  if (!project.castingOffice) {
    return
  }

  const office = Offices.findOne(project.castingOffice) // TODO: error handling
  const newProject = {
    projectId: project._id
  }
  let newProjects = []

  // case 1: there are no projects on the office and office.projects is undefined
  if (!office.projects) {
    newProjects = [newProject]
  } else {
    const i = _.findIndex(office.projects, { projectId: project._id })
    newProjects = office.projects
    if (i < 0) {
      // case 2: this project is not on this office but other projects are and we're adding this project
      newProjects.push(newProject)
    } else {
      // case 3: this project is on this office and we're updating the info
      newProjects[i] = newProject
    }
  }
  Connectors.update(Offices, office._id, { $set: { projects: newProjects } })
}

function ProjectEditUpdateOfficeBefore (data, { currentUser, document, newDocument, collection, context }) {
  const oldOffice = document.castingOffice
  const newOffice = newDocument.castingOffice
  // this is an office getting removed from the project,
  // so we also need to remove the project from that office
  var doIt = false
  if (oldOffice && !newOffice) {
    doIt = true
  }
  if (newOffice && oldOffice && oldOffice.length === newOffice.length && oldOffice !== newOffice) {
    doIt = true
  }
  // only do this when removing or replacing, so
  // newOffice is undefined and oldOffice is an _id or they're both _id's
  if (doIt) {
    const office = Offices.findOne(oldOffice) // TODO: error handling
    var projects = office.projects
    if (!isEmptyValue(projects)) {
      const i = _.findIndex(projects, { projectId: document._id })
      projects.splice(i, 1)
      Connectors.update(Offices, office._id, { $set: { projects: projects } })
    }
  }
}

/* THe non-cron approach: When adding a project, update statistics */
function ProjectNewUpdateStatistics ({ insertedDocument }) {
  const project = insertedDocument
  const currentUser = Users.findOne() // just get the first user available TODO:
  const theStats = Statistics.findOne()
  let newStats = {}
  newStats.episodics = theStats.episodics
  newStats.features = theStats.features
  newStats.pilots = theStats.pilots
  newStats.others = theStats.others

  switch (project.projectType) {
    case 'TV One Hour':
    case 'TV 1/2 Hour':
      const episodicsCasting = Projects.find({
        projectType: { $in: [ 'TV One Hour', 'TV 1/2 Hour' ] },
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

async function ProjectUpdateStatus ({ currentUser, document, newDocument }) {
  // if the new status is now an active project, create new project then remove this past project
  const newIsPast = _.includes(PAST_PROJECT_STATUSES_ARRAY, newDocument.status)
  console.log('ProjectUpdateStatus says newIsPast is', newIsPast)

  if (newIsPast) {
    const createNewPastProject = async () => {
      try {
        return await createMutator({
          collection: PastProjects,
          document: newDocument,
          currentUser: currentUser,
          validate: false
        })
      } catch (err) {
        console.error('error in createNewProject:', err)
      }
    }

    const deleteProject = async () => {
      try {
        return await deleteMutator({
          collection: Projects,
          documentId: document._id,
          currentUser: currentUser,
          validate: false
        })
      } catch (err) {
        console.error('error in deletePastProject:', err)
      }
    }

    const newProject = await createNewPastProject()
    console.log('PastProjectUpdateStatus created project', newProject)
    // if the new project is created and matches (TODO: matches what, exactly?), delete current
    if (newProject.data.projectTitle === newDocument.projectTitle) {
      const deletedProject = await deleteProject()
      console.log('ProjectUpdateStatus deleted project', deletedProject)
    }
  }
}

addCallback('project.update.async', ProjectUpdateStatus)
addCallback('project.update.after', ProjectEditUpdateContacts)
addCallback('project.update.after', ProjectEditUpdateOffice)
addCallback('project.update.before', ProjectEditUpdateOfficeBefore)
addCallback('project.create.after', ProjectEditUpdateContacts)
addCallback('project.create.after', ProjectEditUpdateOffice)
addCallback('project.create.async', ProjectNewUpdateStatistics)
