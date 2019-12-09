import { Connectors, createMutator, deleteMutator } from 'meteor/vulcan:core'
import _ from 'lodash'
import Offices from '../../offices/collection.js'
import Projects from '../collection.js'
import PastProjects from '../../past-projects/collection.js'
import { PAST_PROJECT_STATUSES_ARRAY } from '../../constants.js'

// if the new status is now a past-project, create a new past-project then remove this active project
// if the new project is created and matches (TODO: matches what, exactly?), delete current

export async function ProjectUpdateStatusAsync ({ currentUser, document }) {
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
      Connectors.update(Offices, document.castingOfficeId, {
        $set: {
          pastProjects,
          projects,
          updatedAt: new Date()
        }
      })
    }
  }
}
