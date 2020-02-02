import { Utils } from 'meteor/vulcan:core'

export const getPageUrl = function(comment, isAbsolute = false) {
  const prefix = isAbsolute ? Utils.getSiteUrl().slice(0, -1) : ''
  return `${prefix}/${comment.collectionName}/${comment.objectId}`
}
