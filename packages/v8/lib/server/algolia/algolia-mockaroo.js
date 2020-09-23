import algoliasearch from 'algoliasearch'

const applicationid = Meteor.settings.public.algolia.ApplicationID
const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey
const client = algoliasearch(applicationid, addupdatekey)
const index = client.initIndex(algoliaindex)

const populateAlgoliaMockaroo = (contacts, offices, projects, pastProjects) => {
  var objects = []
  contacts.forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.displayName,
      addressString: o.addressString,
      body: o.body,
      url: `/contacts/${o._id}/${o.slug}`,
      updatedAt: o.updatedAt ? o.updatedAt : o.createdAt,
      boosted: 3
    }
    objects.push(indexedObject)
  })
  offices.forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.displayName,
      addressString: o.fullAddress,
      body: o.body,
      url: `/offices/${o._id}/${o.slug}`,
      updatedAt: o.updatedAt ? o.updatedAt : o.createdAt,
      boosted: 1
    }
    objects.push(indexedObject)
  })
  projects.forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.projectTitle,
      body: o.summary,
      notes: o.notes,
      network: o.network,
      url: `/projects/${o._id}/${o.slug}`,
      updatedAt: o.updatedAt ? o.updatedAt : o.createdAt,
      boosted: 2
    }
    objects.push(indexedObject)
  })
  pastProjects.forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.projectTitle,
      body: o.summary,
      notes: o.notes,
      network: o.network,
      url: `/past-projects/${o._id}/${o.slug}`,
      updatedAt: o.updatedAt ? o.updatedAt : o.createdAt,
      boosted: 0
    }
    objects.push(indexedObject)
  })

  index
    .saveObjects(objects)
    .then((response) => {
      console.group('populateAlgoliaMockaroo response:')
      console.log(response)
      console.groupEnd()
    })
    .catch(err => {
      console.error('populateAlgoliaMockaroo error:', err)
    })
}

export default populateAlgoliaMockaroo
