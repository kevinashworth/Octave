import { extendCollection } from 'meteor/vulcan:core'
import { Offices } from '../../modules/offices/collection.js'
import {
  OfficeEditUpdateAlgoliaBefore,
  OfficeCreateUpdateContacts,
  OfficeEditUpdateContacts,
  OfficeEditUpdatePastProjects,
  OfficeEditUpdateProjects
} from './callbacks/index.js'

extendCollection(Offices, {
  callbacks: {
    create: {
      after: [OfficeCreateUpdateContacts, OfficeEditUpdatePastProjects, OfficeEditUpdateProjects]
    },
    update: {
      before: [OfficeEditUpdateAlgoliaBefore, OfficeEditUpdateContacts, OfficeEditUpdatePastProjects, OfficeEditUpdateProjects]
    }
  }
})
