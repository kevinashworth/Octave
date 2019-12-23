import { extendCollection } from 'meteor/vulcan:core'
import { Contacts } from '../../modules/contacts/collection.js'
import {
  ContactCreateUpdateOffices,
  ContactEditUpdateAlgoliaBefore,
  ContactEditUpdateOffices,
  ContactEditUpdateProjects,
  ContactEditUpdatePastProjects
} from './callbacks/index.js';

extendCollection(Contacts, {
  callbacks: {
    create: {
      after: [ContactCreateUpdateOffices, ContactEditUpdateProjects, ContactEditUpdatePastProjects]
    },
    update: {
      after: [ContactEditUpdateOffices],
      before: [ContactEditUpdateAlgoliaBefore]
    }
  }
})
