import { extendCollection } from 'meteor/vulcan:core'
import { Offices } from '../../modules/offices/collection.js'
import {
  // OfficeEditUpdateAlgoliaBefore,
  OfficeCreateSaveToAlgolia,
  OfficeCreateUpdateContacts,
  OfficeEditUpdateContacts,
  OfficeEditUpdatePastProjects,
  OfficeEditUpdateProjects,
  OfficeCreateFormatPhones,
  OfficeUpdateFormatPhones,
  OfficeEditUpdateHistoryBefore,
} from './callbacks/index.js'

extendCollection(Offices, {
  callbacks: {
    create: {
      before: [OfficeCreateFormatPhones],
      after: [
        OfficeCreateSaveToAlgolia,
        OfficeCreateUpdateContacts,
        OfficeEditUpdatePastProjects,
        OfficeEditUpdateProjects
      ]
    },
    update: {
      before: [
        // OfficeEditUpdateAlgoliaBefore,
        OfficeEditUpdateHistoryBefore,
        OfficeEditUpdateContacts,
        OfficeEditUpdatePastProjects,
        OfficeEditUpdateProjects,
        OfficeUpdateFormatPhones
      ]
    }
  }
})
