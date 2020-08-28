import moment from 'moment'
import { ATLAS, LOCAL, MLAB } from '../modules/constants.js'

/*
Find a user's most recently created item in a collection
*/
export const findLast = function (user, collection) {
  return collection.findOne({ userId: user._id }, { sort: { createdAt: -1 } })
}

/*
Calculate time since creation of most recent item
*/
export const timeSinceLast = (user, collection) => {
  var now = new Date().getTime()
  var last = findLast(user, collection)
  if (!last) return 999 // if this is the user's first post or comment ever, stop here
  return Math.abs(Math.floor((now - last.createdAt) / 1000))
}

/*
Calculate number of items created in past 24 hours
*/
export const numberOfItemsInPast24Hours = (user, collection) => {
  var mNow = moment()
  var items = collection.find({
    userId: user._id,
    createdAt: {
      $gte: mNow.subtract(24, 'hours').toDate()
    }
  })
  return items.count()
}

export const getProcessMongo = () => {
  var mongoUrl = process.env.MONGO_URL
  console.log('mongoUrl:', mongoUrl)
  if (mongoUrl.indexOf('mongodb.net') > -1) {
    return ATLAS
  }
  if (mongoUrl.indexOf('mlab.com') > -1) {
    return MLAB
  }
  if (mongoUrl.indexOf('127.0.0.1') > -1 || mongoUrl.indexOf('localhost') > -1) {
    return LOCAL
  }
  return mongoUrl
}
