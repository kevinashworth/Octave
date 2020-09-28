import algoliasearch from 'algoliasearch'

const applicationid = Meteor.settings.public.search.ApplicationID
const algoliaindex = Meteor.settings.public.search.SearchIndex
const addupdatekey = Meteor.settings.private.search.AddAndUpdateAPIKey

const populateAlgoliaMockaroo = (contacts, offices, projects, pastProjects) => {
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
