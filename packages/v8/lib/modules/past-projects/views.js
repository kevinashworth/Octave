import PastProjects from './collection.js'

// default sort by createdAt timestamp in descending order
PastProjects.addDefaultView(terms => {
  return {
    options: { sort: { updatedAt: -1 } }
  }
})

PastProjects.addView('collectionWithStatus', terms => ({
  selector: {
    status: terms.status
  }
}))

PastProjects.addView('newestPastProjects', terms => ({
  options: { sort: { createdAt: -1 } }
}))
