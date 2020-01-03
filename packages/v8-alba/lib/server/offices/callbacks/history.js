import { Promise } from 'meteor/promise'
import { Connectors } from 'meteor/vulcan:core'
import _ from 'lodash'
import Histories from '../../../modules/history/collection.js'

// See https://gist.github.com/Yimiprod/7ee176597fef230d1451#gistcomment-3102327

const isNullBlankOrUndefined = (o) => {
  return (typeof o === 'undefined' || o == null || o === '')
}

/**
 * Deep diff between two object, using _
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @param  {Object} ignoreBlanks Will not include properties whose value is null, undefined, etc.
 * @return {Object}        Return a new object who represent the diff
 */
const objectDifference = (object, base, ignoreBlanks = true) => {
  if (!_.isObject(object) || _.isDate(object)) return object // special case dates
  return _.transform(object, (result, value, key) => {
    if (!_.isEqual(value, base[key])) {
      if (ignoreBlanks && isNullBlankOrUndefined(value) && isNullBlankOrUndefined(base[key]))
        return;
      result[key] = _.isObject(value) && _.isObject(base[key]) ? objectDifference(value, base[key]) : value;
    }
  });
}

export function OfficeEditUpdateHistoryBefore (data, { originalDocument }) {
  var objectId = originalDocument._id
  var diff = objectDifference(data, originalDocument)
  // console.log(`[KA] ${objectId} diff:`, diff)

  // updatedAt will always be there (right?), so only record history when more than one key in the diff object
  if (Object.keys(diff).length > 1) {
    const { updatedAt, ...rest } = diff
    Promise.await(
      Connectors.update(Histories, objectId,
        {
          $set: { collectionName: 'Offices'},
          $addToSet: {
            changes: {
              date: updatedAt,
              diff: { ...rest }
            }
          }
        },
        { upsert: true }
      )
    )
  }
}
