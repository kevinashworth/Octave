import _ from 'lodash'

const isNullBlankOrUndefined = (o) => {
  return (typeof o === 'undefined' || o == null || o === '')
}

/**
 * Deep diff between two object, using _
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @param  {Object} ignoreBlanks Will not include properties whose value is null, undefined, etc.
 * @return {Object}        Return a new object who represent the diff
 * See https://gist.github.com/Yimiprod/7ee176597fef230d1451#gistcomment-3102327
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

export function OfficeEditUpdateHistoryBefore (data, { document, originalDocument }) {
  var objectId = document._id
  var diff1 = objectDifference(data, originalDocument)

  if (diff1) {
    console.log(`[KA] ${objectId} diff1:`, diff1)
    console.log(`[KA] ${objectId} diff1 stringify:`, JSON.stringify(diff1))
  }
}
