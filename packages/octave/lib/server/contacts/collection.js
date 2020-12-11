import { extendCollection } from 'meteor/vulcan:core'
import { Contacts } from '../../modules/contacts/collection.js'
import {
  createAlgoliaObject,
  updateAlgoliaObject,
  createContactUpdateOffices,
  updateContactUpdateOffices,
  updateOfficeNames,
  createContactUpdateProjects,
  updateContactUpdateProjects,
  updateProjectTitles,
  createContactUpdatePastProjects,
  updateContactUpdatePastProjects,
  updatePastProjectTitles
} from './callbacks/index.js'
import { updatePatches } from '../patches/callback'

extendCollection(Contacts, {
  callbacks: {
    create: {
      async: [
        createAlgoliaObject,
        createContactUpdateOffices,
        createContactUpdateProjects,
        createContactUpdatePastProjects
      ]
    },
    update: {
      before: [
        updateOfficeNames,
        updateProjectTitles,
        updatePastProjectTitles
      ],
      async: [
        updateAlgoliaObject,
        updateContactUpdateOffices,
        updateContactUpdateProjects,
        updateContactUpdatePastProjects,
        updatePatches
      ]
    }
  }
})

Contacts.rawCollection().createIndex({ updatedAt: -1 })
Contacts.rawCollection().createIndex({ lastName: 1 })
