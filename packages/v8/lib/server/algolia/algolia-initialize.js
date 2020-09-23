import algoliasearch from 'algoliasearch'
import Contacts from '../../modules/contacts/collection.js'
import Offices from '../../modules/offices/collection.js'
import Projects from '../../modules/projects/collection.js'
import PastProjects from '../../modules/past-projects/collection.js'

const applicationid = Meteor.settings.public.algolia.ApplicationID
const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey

const populateAlgoliaIndex = () => {
  const client = algoliasearch(applicationid, addupdatekey)
  const index = client.initIndex(algoliaindex)

  index.setSettings({
    attributesToHighlight: [
      'body',
      'name'
    ],
    attributesToSnippet: [
      'body:10'
    ],
    exactOnSingleWordQuery: 'word',
    highlightPostTag: '</strong>',
    highlightPreTag: '<strong>',
    hitsPerPage: 24,
    paginationLimitedTo: 48,
    ranking: [
      'desc(boosted)',
      'exact',
      'asc(name)',
      'desc(updatedAt)',
      'typo',
      'words',
      'proximity',
      'attribute'
    ],
    searchableAttributes: [
      'name',
      'body',
      'notes',
      'addressString',
      'network',
      'url'
    ],
    snippetEllipsisText: '…'
  })

  index.getSettings()
    .then(response => {
      console.group('After setSettings, results of Algolia getSettings:')
      console.log(response)
      console.groupEnd()
    })
    .catch(error => {
      console.group('Algolia getSettings error:', error)
      console.error(error)
      console.groupEnd()
    })

  var objects = []
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
      console.group('AlgoliaLog saveObjects response:')
      console.log(response)
      console.groupEnd()
    })
    .catch(err => {
      console.group('AlgoliaLog saveObjects error:')
      console.error(err)
      console.groupEnd()
    })
}

Meteor.startup(() => {
  populateAlgoliaIndex()
})
