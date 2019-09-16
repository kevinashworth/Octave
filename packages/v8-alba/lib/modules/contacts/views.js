import Contacts from './collection.js'

// default sort by updatedAt timestamp in descending order
Contacts.addDefaultView(terms => {
  return {
    options: { sort: { updatedAt: -1 } }
  }
})

Contacts.addView('contactsByLastName', terms => ({
  options: { sort: { lastName: 1 } }
}))
