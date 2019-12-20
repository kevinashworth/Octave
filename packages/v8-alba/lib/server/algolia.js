import { updateMutator } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import algoliasearch from 'algoliasearch'
import Algolia from '../modules/algolia/collection.js'
import Contacts from '../modules/contacts/collection.js'
import Offices from '../modules/offices/collection.js'
import Projects from '../modules/projects/collection.js'
import PastProjects from '../modules/past-projects/collection.js'

let applicationid = Meteor.settings.private.algolia.ApplicationID
let adminapikey   = Meteor.settings.private.algolia.AdminAPIKey
let algoliaindex  = Meteor.settings.private.algolia.AlgoliaIndex

const currentUser = Users.findOne() // just get the first user available
let algoliaLog = Algolia.findOne()

const createAlgoliaIndex = () => {
  const client = algoliasearch(applicationid, adminapikey)
  const index = client.initIndex(algoliaindex)

  index.getSettings((err, content) => {
    if (err) {
      console.error('Algolia getSettings error:', err)
    }
    console.group('Algolia getSettings:')
    console.log(content)
    console.groupEnd()
  })

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
      algoliaLog.push({ date: new Date(), objectCount: objectIDs.length })
      Promise.await(updateMutator({
        action: 'algolia.update',
        documentId: algoliaLog._id,
        collection: Algolia,
        set: algoliaLog,
        currentUser,
        validate: false
      }))
      console.group('Algolia saveObjects:')
      console.log(objectIDs)
      console.groupEnd()
    })
    .catch(err => {
      console.error('Algolia saveObjects error:', err)
    })
}

Meteor.startup(() => {
  createAlgoliaIndex()
})
