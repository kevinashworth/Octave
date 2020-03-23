import { extendCollection } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import {
  callbackXYZ
} from './callbacks/index.js'

extendCollection(Users, {
  callbacks: {
    create: {
      after: [callbackXYZ]
    },
    update: {
      after: [callbackXYZ],
      before: [callbackXYZ]
    }
  }
})
