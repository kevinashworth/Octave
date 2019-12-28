import { updateMutator } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import algoliasearch from 'algoliasearch'
import AlgoliaLog from '../modules/algolia-log/collection.js'
import Contacts from '../modules/contacts/collection.js'
import Offices from '../modules/offices/collection.js'
import Projects from '../modules/projects/collection.js'
import PastProjects from '../modules/past-projects/collection.js'

const applicationid = Meteor.settings.private.algolia.ApplicationID
const adminapikey   = Meteor.settings.private.algolia.AdminAPIKey
const algoliaindex  = Meteor.settings.private.algolia.AlgoliaIndex
//
const currentUser = Users.findOne() // just get the first user available
let algoliaLog = AlgoliaLog.findOne()

const createAlgoliaIndex = () => {
  const client = algoliasearch(applicationid, adminapikey)
  const index = client.initIndex(algoliaindex)

  index.setSettings({
    customRanking: [
      'asc(name)',
      'desc(boosted)',
      'asc(updatedAt)'
    ],
    searchableAttributes: [
      'name',
      'body',
      'notes',
      'addressString',
      'network'
    ],
    highlightPreTag: '<strong>',
    highlightPostTag: '</strong>',
    attributesToSnippet: [
      'body:10'
    ],
    snippetEllipsisText: '…',
    hitsPerPage: 16
  });

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
      addressString: o.addressString,
      body: o.body,
      url: `/contacts/${o._id}/${o.slug}`,
      updatedAt: o.updatedAt ? o.updatedAt : o.createdAt,
      boosted: 3
    }
    objects.push(indexedObject)
  })
  Offices.find().forEach((o) => {
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
  Projects.find().forEach((o) => {
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
  PastProjects.find().forEach((o) => {
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
      algoliaLog.algolia.push({ dateOfSend: new Date(), sentObjectCount: response.objectIDs.length })
      Promise.await(updateMutator({
        action: 'algolialog.update',
        documentId: algoliaLog._id,
        collection: AlgoliaLog,
        set: AlgoliaLog,
        currentUser,
        validate: false
      }))
      console.group('AlgoliaLog saveObjects response:')
      console.log(response)
      console.groupEnd()
    })
    .catch(err => {
      console.error('AlgoliaLog saveObjects error:', err)
    })
}

Meteor.startup(() => {
  createAlgoliaIndex()
})
