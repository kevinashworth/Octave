import { updateMutator } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import algoliasearch from 'algoliasearch'
import moment from 'moment'
import AlgoliaLog from './collection.js'
import Contacts from '../contacts/collection.js'
import Offices from '../offices/collection.js'
import Projects from '../projects/collection.js'
import PastProjects from '../past-projects/collection.js'
import { DATE_FORMAT_MONGO } from '../constants.js'

const applicationid = '14RUP1OK0B'
const adminapikey   = '3dc35c472370620d7003a876bf992abe'
const algoliaindex  = 'dev_v8-alba-mlab'

const currentUser = Users.findOne() // just get the first user available

export const updateAlgoliaIndex = (algoliaLog) => {
  const client = algoliasearch(applicationid, adminapikey)
  const index = client.initIndex(algoliaindex)

  console.group('[KA] algoliaLog:')
  console.log(algoliaLog)
  console.groupEnd()
  const lastUpdate = new Date(algoliaLog.algolia[0].Date)

  const selector = { $or: [ { createdAt: { $gte: lastUpdate }, updatedAt: { $gte: lastUpdate } } ] }

  let objects = []
  Contacts.find(selector).forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.displayName,
      url: `/contacts/${o._id}/${o.slug}`,
      addressString: o.addressString,
      allLinks: o.allLinks,
      body: o.body,
      boosted: 3
    }
    objects.push(indexedObject)
  })
  Offices.find(selector).forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.displayName,
      url: `/offices/${o._id}/${o.slug}`,
      fullAddress: o.fullAddress,
      body: o.body,
      boosted: 2
    }
    objects.push(indexedObject)
  })
  Projects.find(selector).forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.projectTitle,
      url: `/projects/${o._id}/${o.slug}`,
      network: o.network,
      summary: o.summary,
      notes: o.notes,
      boosted: 3
    }
    objects.push(indexedObject)
  })
  PastProjects.find(selector).forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.projectTitle,
      url: `/past-projects/${o._id}/${o.slug}`,
      network: o.network,
      summary: o.summary,
      notes: o.notes,
      boosted: 0
    }
    objects.push(indexedObject)
  })

  index
    .saveObjects(objects)
    .then(({ objectIDs }) => {
      algoliaLog.algolia.push({ date: moment().format(DATE_FORMAT_MONGO), objectCount: objectIDs.length })
      Promise.await(updateMutator({
        action: 'algolia.update',
        documentId: algoliaLog._id,
        collection: AlgoliaLog,
        set: algoliaLog,
        currentUser,
        validate: false
      }))
      console.group('updateAlgoliaIndex saveObjects:')
      console.log(objects)
      console.groupEnd()
    })
    .catch(err => {
      console.error('AlgoliaLog saveObjects error:', err)
    })
}
