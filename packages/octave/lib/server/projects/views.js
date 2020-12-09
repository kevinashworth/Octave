import { Projects } from '../../modules/projects/collection.js'

// else default sort is createdAt in descending order
Projects.addDefaultView(terms => ({
  options: { sort: { updatedAt: -1 } }
}))

Projects.addView('projectsCastingByCreated', terms => ({
  selector: {
    status: 'Casting'
  },
  options: { sort: { createdAt: -1 } }
}))

// Projects.addView('collectionWithStatus', terms => ({
//   selector: {
//     status: terms.status
//   }
// }))

// Projects.addView('projectsByTitle', terms => ({
//   options: { sort: { sortTitle: 1 } }
// }))
