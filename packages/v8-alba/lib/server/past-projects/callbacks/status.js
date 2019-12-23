import { Connectors, createMutator, deleteMutator } from 'meteor/vulcan:core'
import _ from 'lodash'
import Offices from '../../../modules/offices/collection.js'
import Projects from '../../../modules/projects/collection.js'
import PastProjects from '../../../modules/past-projects/collection.js'
import { ACTIVE_PROJECT_STATUSES_ARRAY } from '../../../modules/constants.js'

// if the new status is now an active project, create a new project then remove this past-project
// if the new project is created and matches (TODO: matches what, exactly?), delete current

export function PastProjectUpdateStatusAfter (document, { context, currentUser }) {
  const newStatusIsActive = _.includes(ACTIVE_PROJECT_STATUSES_ARRAY, document.status)

  if (newStatusIsActive) {
    const { data: newProject } = Promise.await(createMutator({
      collection: Projects,
      document,
      currentUser,
      validate: false
    }))

    if (newProject.projectTitle === document.projectTitle) {
      Promise.await(deleteMutator({
        collection: PastProjects,
        documentId: document._id,
        currentUser,
        validate: false,
        context
      }))
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
