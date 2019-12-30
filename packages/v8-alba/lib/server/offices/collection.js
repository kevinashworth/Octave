import { extendCollection } from 'meteor/vulcan:core'
import { Offices } from '../../modules/offices/collection.js'
import {
  OfficeEditUpdateAlgoliaBefore,
  OfficeCreateSaveToAlgolia,
  OfficeCreateUpdateContacts,
  OfficeEditUpdateContacts,
  OfficeEditUpdatePastProjects,
  OfficeEditUpdateProjects,
  OfficeEditFormatPhones
} from './callbacks/index.js'

extendCollection(Offices, {
  callbacks: {
    create: {
      before: [OfficeEditFormatPhones],
      after: [OfficeCreateSaveToAlgolia, OfficeCreateUpdateContacts, OfficeEditUpdatePastProjects, OfficeEditUpdateProjects]
    },
    update: {
      before: [OfficeEditUpdateAlgoliaBefore, OfficeEditUpdateContacts, OfficeEditUpdatePastProjects, OfficeEditUpdateProjects, OfficeEditFormatPhones]
    }
  }
})
