import algoliasearch from 'algoliasearch'
import Contacts from '../modules/contacts/collection.js'
import Offices from '../modules/offices/collection.js'
import Projects from '../modules/projects/collection.js'
import PastProjects from '../modules/past-projects/collection.js'

const createAlgoliaIndex = () => {
  const client = algoliasearch(Meteor.settings.private.algolia.applicationid, Meteor.settings.private.algolia.adminapikey)
  const index = client.initIndex(Meteor.settings.private.algolia.index)
  let objects = []
  Contacts.find().forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.displayName,
      url: `/contacts/${o._id}/${o.slug}`
    }
    objects.push(indexedObject)
  })
  Offices.find().forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.displayName,
      url: `/offices/${o._id}/${o.slug}`
    }
    objects.push(indexedObject)
  })
  Projects.find().forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.projectTitle,
      url: `/projects/${o._id}/${o.slug}`
    }
    objects.push(indexedObject)
  })
  PastProjects.find().forEach((o) => {
    const indexedObject = {
      objectID: o._id,
      name: o.projectTitle,
      url: `/pastprojects/${o._id}/${o.slug}`
    }
    objects.push(indexedObject)
  })

  index
    .saveObjects(objects)
    .then(({ objectIDs }) => {
      console.log(objectIDs);
    })
    .catch(err => {
      console.error(err);
    });

}

Meteor.startup(() => {
  createAlgoliaIndex()
})
