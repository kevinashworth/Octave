import { Connectors } from 'meteor/vulcan:core'
import { Promise } from 'meteor/promise'

// import { updateMutator } from 'meteor/vulcan:core'
// import Users from 'meteor/vulcan:users'
// import algoliasearch from 'algoliasearch'
import moment from 'moment'
// import AlgoliaLog from './collection.js'
import Contacts from '../contacts/collection.js'
// import Offices from '../offices/collection.js'
// import Projects from '../projects/collection.js'
// import PastProjects from '../past-projects/collection.js'
import { DATE_FORMAT_MONGO } from '../constants.js'

// const applicationid = '14RUP1OK0B'
// const adminapikey   = '3dc35c472370620d7003a876bf992abe'
// const algoliaindex  = 'dev_v8-alba-mlab'

// const currentUser = Users.findOne() // just get the first user available

export const updateAlgoliaIndex = (algoliaLog) => {
  // const client = algoliasearch(applicationid, adminapikey)
  // const index = client.initIndex(algoliaindex)

  console.group('[KA] algoliaLog:')
  console.log(algoliaLog)
  console.groupEnd()

  // const lastUpdate = moment('2019-12-13 22:20:46').format(DATE_FORMAT_MONGO)
  const lastUpdate = new Date('2019-12-21T15:28:22.599Z').toISOString()
  // const lastUpdate = new Date('2019-12-21T15:28:22.599Z')
  // const lastUpdate = new Date('2019-12-13 22:20:46')
  // const lastUpdate = new Date(algoliaLog.algolia[0].date)
  const selector = { $or: [
    { createdAt: { $gte: lastUpdate } },
    { updatedAt: { $gte: lastUpdate } }
  ] }

// db.contacts.find({ $or: [ { createdAt: { $gte: ISODate('2019-12-13 22:20:46') } } , { updatedAt: { $gte: ISODate('2019-12-13 22:20:46') } } ] }).pretty()

  console.group('[KA] lastUpdate & selector:')
  console.log(lastUpdate)
  console.log(selector)
  console.groupEnd()

  let objects = []
  if (Meteor.isServer) {
    const printThis = Promise.await(Connectors.find(Contacts, {_id: 'NEX4oZE7uKYNuCfFv'}, { fields: { _id: 1 }}))
    console.info('[KA] printThis:', printThis)
  }
  // .forEach((o) => {
  //   const indexedObject = {
  //     objectID: o._id,
  //     name: o.displayName,
  //     url: `/contacts/${o._id}/${o.slug}`,
  //     addressString: o.addressString,
  //     allLinks: o.allLinks,
  //     body: o.body,
  //     boosted: 3
  //   }
  //   objects.push(indexedObject)
  // })
  // Offices.find(selector).forEach((o) => {
  //   const indexedObject = {
  //     objectID: o._id,
  //     name: o.displayName,
  //     url: `/offices/${o._id}/${o.slug}`,
  //     fullAddress: o.fullAddress,
  //     body: o.body,
  //     boosted: 2
  //   }
  //   objects.push(indexedObject)
  // })
  // Projects.find(selector).forEach((o) => {
  //   const indexedObject = {
  //     objectID: o._id,
  //     name: o.projectTitle,
  //     url: `/projects/${o._id}/${o.slug}`,
  //     network: o.network,
  //     summary: o.summary,
  //     notes: o.notes,
  //     boosted: 3
  //   }
  //   objects.push(indexedObject)
  // })
  // PastProjects.find(selector).forEach((o) => {
  //   const indexedObject = {
  //     objectID: o._id,
  //     name: o.projectTitle,
  //     url: `/past-projects/${o._id}/${o.slug}`,
  //     network: o.network,
  //     summary: o.summary,
  //     notes: o.notes,
  //     boosted: 0
  //   }
  //   objects.push(indexedObject)
  // })

  console.group('[KA] Would send these to saveObjects:')
  console.log(objects)
  console.groupEnd()


  // index
  //   .saveObjects(objects)
  //   .then(({ objectIDs }) => {
      // algoliaLog.algolia.push({ date: moment().format(DATE_FORMAT_MONGO), objectCount: objectIDs.length })
      // Promise.await(updateMutator({
      //   action: 'algolia.update',
      //   documentId: algoliaLog._id,
      //   collection: AlgoliaLog,
      //   set: algoliaLog,
      //   currentUser,
      //   validate: false
      // }))
    //   console.group('updateAlgoliaIndex saveObjects:')
    //   console.log(objects)
    //   console.groupEnd()
    // })
    // .catch(err => {
    //   console.error('AlgoliaLog saveObjects error:', err)
    // })

  return {
    dateOfSend: moment().format(DATE_FORMAT_MONGO),
    sentObjectCount: objects.length
  }
}
