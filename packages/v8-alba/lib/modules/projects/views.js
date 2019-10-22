import Projects from './collection.js'

// default sort by createdAt timestamp in descending order
Projects.addDefaultView(terms => {
  return {
    options: { sort: { updatedAt: -1 } }
  }
})

Projects.addView('collectionWithStatus', terms => ({
  selector: {
    status: terms.status
  }
}))

Projects.addView('projectsByTitle', terms => ({
  options: { sort: { sortTitle: 1 } }
}))
