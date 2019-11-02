import algoliasearch from 'algoliasearch'
import Contacts from '../modules/contacts/collection.js'
import Offices from '../modules/offices/collection.js'
import Projects from '../modules/projects/collection.js'
import PastProjects from '../modules/past-projects/collection.js'

let applicationid = Meteor.settings.private.algolia.ApplicationID
let adminapikey   = Meteor.settings.private.algolia.AdminAPIKey
let algoliaindex  = Meteor.settings.private.algolia.AlgoliaIndex

const createAlgoliaIndex = () => {
  const client = algoliasearch(applicationid, adminapikey)
  const index = client.initIndex(algoliaindex)
  let objects = []
  Contacts.find().forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.displayName,
      url: `/contacts/${o._id}/${o.slug}`,
      addressString: o.addressString,
      allLinks: o.allLinks,
      body: o.body
    }
    objects.push(indexedObject)
  })
  Offices.find().forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.displayName,
      url: `/offices/${o._id}/${o.slug}`,
      fullAddress: o.fullAddress,
      body: o.body
    }
    objects.push(indexedObject)
  })
  Projects.find().forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.projectTitle,
      url: `/projects/${o._id}/${o.slug}`,
      network: o.network,
      summary: o.summary,
      notes: o.notes
    }
    objects.push(indexedObject)
  })
  PastProjects.find().forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.projectTitle,
      url: `/past-projects/${o._id}/${o.slug}`,
      network: o.network,
      summary: o.summary,
      notes: o.notes
    }
    objects.push(indexedObject)
  })

  index
    .saveObjects(objects)
    .then(({ objectIDs }) => {
      console.log(objectIDs)
    })
    .catch(err => {
      console.error(err)
    })
}

Meteor.startup(() => {
  createAlgoliaIndex()
})
