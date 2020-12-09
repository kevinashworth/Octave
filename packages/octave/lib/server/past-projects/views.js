import PastProjects from '../../modules/past-projects/collection.js'

// else default sort is createdAt in descending order
PastProjects.addDefaultView(terms => ({
  options: { sort: { updatedAt: -1 } }
}))

// PastProjects.addView('collectionWithStatus', terms => ({
//   selector: {
//     status: terms.status
//   }
// }))

// PastProjects.addView('pastProjectsByCreated', terms => ({
//   options: { sort: { createdAt: -1 } }
// }))
