import { extendCollection } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import {
  callbackXYZ
} from './callbacks/index.js'
import schema from '../../modules/users/schema.js'

extendCollection(Users, {
  callbacks: {
    create: {
      after: [callbackXYZ]
    },
    update: {
      after: [callbackXYZ],
      before: [callbackXYZ]
    }
  },
  schema
})
