import Offices from '../../modules/offices/collection.js'

// else default sort is createdAt in descending order
Offices.addDefaultView(terms => ({
  options: {
    sort: { updatedAt: -1 }
  }
}))

// Offices.addView('officesByUpdated', terms => ({
//   options: {
//     sort: { updatedAt: -1 }
//   }
// }))

// Offices.addView('officesByDisplayName', terms => ({
//   options: {
//     sort: { displayName: 1 }
//   }
// }))
