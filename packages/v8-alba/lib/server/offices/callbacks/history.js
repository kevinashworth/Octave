/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/

import { Promise } from 'meteor/promise'
import { Connectors } from 'meteor/vulcan:core'
import * as jsonpatch from 'fast-json-patch'
// import _ from 'lodash'
import Histories from '../../../modules/history/collection.js'

// See https://gist.github.com/Yimiprod/7ee176597fef230d1451#gistcomment-3102327

// const isNullBlankOrUndefined = (o) => {
//   return (typeof o === 'undefined' || o == null || o === '')
// }
//
// /**
//  * Deep diff between two object, using _
//  * @param  {Object} object Object compared
//  * @param  {Object} base   Object to compare with
//  * @param  {Object} ignoreBlanks Will not include properties whose value is null, undefined, etc.
//  * @return {Object}        Return a new object who represent the diff
//  */
// const objectDifference = (object, base, ignoreBlanks = true) => {
//   if (!_.isObject(object) || _.isDate(object)) return object // special case dates
//   return _.transform(object, (result, value, key) => {
//     if (!_.isEqual(value, base[key])) {
//       if (ignoreBlanks && isNullBlankOrUndefined(value) && isNullBlankOrUndefined(base[key]))
//         return;
//       result[key] = _.isObject(value) && _.isObject(base[key]) ? objectDifference(value, base[key]) : value;
//     }
//   });
// }

const fastDiff = (documentA, documentB) => {
  var diff = jsonpatch.compare(documentA, documentB)
  return diff
}

export function OfficeEditUpdateHistoryBefore (data, { originalDocument }) {
  var objectId = originalDocument._id

  let { _id, userId, createdAt, ...myData } = data
  myData.updatedAt = data.updatedAt && typeof data.updatedAt === 'object' ? data.updatedAt.toUTCString() : new Date().toUTCString()

  let { _id: ID, userId: userID, createdAt: createdAT, ...myDocument } = originalDocument
  myDocument.updatedAt = originalDocument.updatedAt && typeof originalDocument.updatedAt === 'object' ? originalDocument.updatedAt.toUTCString() : new Date().toUTCString()

  var diff2 = fastDiff(myDocument, myData)
  console.log(`[KA] ${objectId} FAST diff2:`, diff2)

  // If there are no differences, `compare` returns an empty array (length 0).
  if (diff2.length > 0) {
    Promise.await(
      Connectors.update(Histories, objectId,
        {
          $set: { collectionName: 'Offices' },
          $addToSet: {
            changes: {
              date: new Date().toUTCString(),
              diff: diff2
            }
          }
        },
        { upsert: true }
      )
    )
  }
}
