import { extendCollection } from 'meteor/vulcan:core'
import { Contacts } from '../../modules/contacts/collection.js'
import {
  ContactEditUpdateAlgoliaBefore,
  ContactCreateUpdateOffices,
  ContactEditUpdateOffices,
  ContactEditUpdateProjects,
  ContactEditUpdatePastProjects
} from './callbacks/index.js'

extendCollection(Contacts, {
  callbacks: {
    create: {
      after: [ContactCreateUpdateOffices, ContactEditUpdateProjects, ContactEditUpdatePastProjects]
    },
    update: {
      after: [ContactEditUpdateOffices, ContactEditUpdateProjects, ContactEditUpdatePastProjects],
      before: [ContactEditUpdateAlgoliaBefore]
    }
  }
})
