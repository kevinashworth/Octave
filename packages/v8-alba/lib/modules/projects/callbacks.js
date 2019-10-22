import { addCallback, Connectors, createMutator, deleteMutator, updateMutator } from 'meteor/vulcan:core'
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
function ProjectEditUpdateContacts (data, { document }) {
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
      const sortedPastProjects = _.sortBy(newPastProjects, ['projectTitle'])
      Connectors.update(Contacts, contact._id, { $set: {
        pastProjects: sortedPastProjects,
        updatedAt: new Date()
      } })

      // also remove the project from contact.projects
      if (!isEmptyValue(contact.projects)) {
        var newProjects = contact.projects
        const i = _.findIndex(contact.projects, { projectId: project._id })
        if (i > -1) {
          newProjects.splice(i, 1)
          Connectors.update(Contacts, contact._id, { $set: {
            projects: newProjects,
            updatedAt: new Date()
          } })
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
      Connectors.update(Contacts, contact._id, { $set: {
        projects: newProjects,
        updatedAt: new Date()
      } })
    }
  })
}

/*
When updating an office on a project, also update that office with the project.
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
function ProjectEditUpdateOfficeAfter (data, { document }) {
  const project = document
  if (!project.castingOfficeId) {
    return
  }

  const office = Offices.findOne(project.castingOfficeId) // TODO: error handling
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
  Connectors.update(Offices, office._id, { $set: {
    projects: newProjects,
    updatedAt: new Date()
  } })
}

function ProjectEditUpdateOfficeBefore (data, { document, oldDocument }) {
  const oldOffice = oldDocument.castingOfficeId
  const newOffice = document.castingOfficeId
  let adding = false
  if (newOffice && !oldOffice) {
    adding = true
  }
  let removing = false
  if (oldOffice && !newOffice) {
    // this is an office getting removed from the project, so we also need to remove the project from that office
    removing = true
  }
  let replacing = false
  if (newOffice && oldOffice && oldOffice !== newOffice) {
    // this is one office replacing another on the project
    removing = false
    replacing = true
  }
  let itmightnotbethereforsomereason = false
  if (newOffice === oldOffice) {
    console.info('itmightnotbethereforsomereason')
    itmightnotbethereforsomereason = true
  }

  let office = null
  let projects = null
  if (adding) {
    office = Offices.findOne(newOffice) // TODO: error handling
    projects = office && office.projects
  }
  if (removing || replacing || itmightnotbethereforsomereason) {
    office = Offices.findOne(oldOffice) // TODO: error handling
    projects = office && office.projects
  }
  if (!office) {
    console.log('findOne didn\'t find one office!')
  }
  if (!isEmptyValue(projects)) {
    if (itmightnotbethereforsomereason) {
      if (_.indexOf(projects, { projectId: document._id }) < 0) {
        replacing = true
        console.info('itisnotthereforsomereason')
      }
    }
    _.remove(projects, function (p) {
      return p.projectId === document._id
    })
    if (adding || replacing) {
      projects.push({ projectId: document._id })
    }
    Connectors.update(Offices, office._id, { $set: {
      projects: projects,
      updatedAt: new Date()
    } })
  } else if (adding || itmightnotbethereforsomereason) { // means we are adding to empty (or null) projects
    projects = [{ projectId: document._id }]
    Connectors.update(Offices, office._id, { $set: {
      projects: projects,
      updatedAt: new Date()
    } })
  }
}

function latestStatIsFromToday (theStatsArray) {
  const latestDate = theStatsArray[theStatsArray.length - 1].date
  const today = new Date()
  return moment(latestDate).isSame(today, 'day')
}

/* When adding a project, update statistics */
async function ProjectCreateUpdateStatisticsAsync ({ currentUser, document }) {
  const project = document
  const theStats = await Statistics.findOne()
  let newStats = { ...theStats } // TODO: do we need to work with a copy?

  switch (project.projectType) {
    case 'TV One Hour':
    case 'TV 1/2 Hour':
    case 'TV Animation':
      const episodicsCasting = Projects.find({
        projectType: { $in: ['TV One Hour', 'TV 1/2 Hour', 'TV Animation'] },
        status: 'Casting'
      }).count()
      console.debug('There are ' + newStats.episodics.length + ' episodics, ' + episodicsCasting + ' casting.')
      console.debug('The most recent one is from ' + newStats.episodics[newStats.episodics.length - 1].date)
      if (latestStatIsFromToday(newStats.episodics)) { // this is the same day, replace the last stat with the new stat
        console.debug('This is today, so replacing the following popped stat:', newStats.episodics.pop())
      }
      newStats.episodics.push({ date: moment().format('YYYY-MM-DD HH:mm:ss'), quantity: episodicsCasting })
      break
    case 'Feature Film':
    case 'Feature Film (LB)':
    case 'Feature Film (MLB)':
    case 'Feature Film (ULB)':
      const featuresCasting = Projects.find({
        projectType: { $in: ['Feature Film', 'Feature Film (LB)', 'Feature Film (MLB)', 'Feature Film (ULB)'] },
        status: 'Casting'
      }).count()
      console.debug('There are ' + newStats.features.length + ' features, ' + featuresCasting + ' casting.')
      console.debug('The most recent one is from ' + newStats.features[newStats.features.length - 1].date)
      if (latestStatIsFromToday(newStats.features)) { // this is the same day, replace the last stat with the new stat
        console.debug('This is today, so replacing the following popped stat:', newStats.features.pop())
      }
      newStats.features.push({ date: moment().format('YYYY-MM-DD HH:mm:ss'), quantity: featuresCasting })
      break
    case 'Pilot One Hour':
    case 'Pilot 1/2 Hour':
    case 'Pilot Presentation':
      const pilotsCasting = Projects.find({
        projectType: { $in: ['Pilot One Hour', 'Pilot 1/2 Hour', 'Pilot Presentation'] },
        status: 'Casting'
      }).count()
      console.debug('There are ' + newStats.pilots.length + ' pilots, ' + pilotsCasting + ' casting.')
      console.debug('The most recent one is from ' + newStats.pilots[newStats.pilots.length - 1].date)
      if (latestStatIsFromToday(newStats.pilots)) { // this is the same day, replace the last stat with the new stat
        console.debug('This is today, so replacing the following popped stat:', newStats.pilots.pop())
      }
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
        projectType: { $in: ['Short Film', 'TV Daytime', 'TV Mini-Series', 'TV Movie', 'TV Telefilm', 'TV Talk/Variety', 'TV Sketch/Improv', 'New Media'] },
        status: 'Casting'
      }).count()
      console.debug('There are ' + newStats.others.length + ' others, ' + othersCasting + ' casting.')
      console.debug('The most recent one is from ' + newStats.others[newStats.others.length - 1].date)
      if (latestStatIsFromToday(newStats.others)) { // this is the same day, replace the last stat with the new stat
        console.debug('This is today, so replacing the following popped stat:', newStats.others.pop())
      }
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

async function ProjectUpdateStatusAsync ({ currentUser, document, oldDocument }) {
  // if the new status is now a past-project, create a new past-project then remove this active project
  const newStatusIsPast = _.includes(PAST_PROJECT_STATUSES_ARRAY, document.status)

  const createNewPastProject = async () => {
    try {
      return await createMutator({
        collection: PastProjects,
        document,
        currentUser,
        validate: false
      })
    } catch (err) {
      console.error('error in createNewPastProject:', err)
    }
  }

  const deleteProject = async () => {
    try {
      return await deleteMutator({
        collection: Projects,
        documentId: document._id,
        currentUser,
        validate: false
      })
    } catch (err) {
      console.error('error in deleteProject:', err)
    }
  }

  if (newStatusIsPast) {
    const newPastProject = (await createNewPastProject()).data

    // if the new project is created and matches (TODO: matches what, exactly?), delete current
    if (newPastProject.projectTitle === document.projectTitle) {
      await deleteProject()
    }

    if (document.castingOfficeId) {
      let pastProjects = []
      let projects = []
      const office = Offices.findOne(document.castingOfficeId)
      if (office.projects && office.projects.length) {
        projects = office.projects
        _.remove(projects, function (p) {
          return p._id === document._id
        })
      }
      if (office.pastProjects && office.pastProjects.length) {
        pastProjects = office.pastProjects
      }
      pastProjects.push({ projectId: newPastProject._id })
      Connectors.update(Offices, document.castingOfficeId, { $set: {
        pastProjects,
        projects,
        updatedAt: new Date()
      } })
    }
  }
}

addCallback('project.create.after', ProjectEditUpdateContacts)
addCallback('project.create.after', ProjectEditUpdateOfficeAfter)
addCallback('project.create.async', ProjectCreateUpdateStatisticsAsync)

addCallback('project.update.before', ProjectEditUpdateOfficeBefore)
addCallback('project.update.after', ProjectEditUpdateContacts)
addCallback('project.update.async', ProjectUpdateStatusAsync)
