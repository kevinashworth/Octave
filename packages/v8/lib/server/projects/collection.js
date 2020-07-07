import { extendCollection } from 'meteor/vulcan:core'
import { Projects } from '../../modules/projects/collection.js'
import {
  ProjectEditUpdateAlgoliaBefore,
  ProjectCreateSaveToAlgolia,
  ProjectEditUpdateContacts,
  ProjectCreateUpdateContacts,
  ProjectEditUpdateOfficesBefore,
  ProjectCreateUpdateOfficesAfter,
  ProjectCreateUpdateStatisticsAfter,
  ProjectEditUpdateStatusAfter,
  ProjectEditUpdateHistoryAfter
} from './callbacks/index.js'

extendCollection(Projects, {
  callbacks: {
    create: {
      after: [ProjectCreateSaveToAlgolia, ProjectCreateUpdateContacts, ProjectCreateUpdateOfficesAfter, ProjectCreateUpdateStatisticsAfter]
    },
    update: {
      after: [ProjectEditUpdateContacts, ProjectEditUpdateHistoryAfter, ProjectEditUpdateStatusAfter],
      before: [ProjectEditUpdateAlgoliaBefore, ProjectEditUpdateOfficesBefore]
    }
  }
})

Projects.rawCollection().createIndex({ updatedAt: -1 })

// else default sort by createdAt timestamp in descending order
Projects.addDefaultView(terms => ({
  options: { sort: { updatedAt: -1 } }
}))

Projects.addView('collectionWithStatus', terms => ({
  selector: {
    status: terms.status
  }
}))

Projects.addView('projectsByTitle', terms => ({
  options: { sort: { sortTitle: 1 } }
}))

// Projects.addView('projectsByUpdated', terms => ({
//   options: { sort: { updatedAt: -1 } }
// }))
//
Projects.addView('newestProjectsCasting', terms => ({
  selector: {
    status: 'Casting'
  },
  options: { sort: { createdAt: -1 } }
}))
