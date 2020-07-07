import Contacts from '../../modules/contacts/collection.js'

// else default sort is createdAt in descending order
Contacts.addDefaultView(terms => ({
  options: { sort: { updatedAt: -1 } }
}))

// Contacts.addView('contactsByLastName', terms => ({
//   options: { sort: { lastName: 1 } }
// }))
