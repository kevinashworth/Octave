import { Meteor } from 'meteor/meteor'

Meteor.methods({
  getProcessEnvMongoUrl: function () {
    var mongoURL = process.env.MONGO_URL
    return mongoURL
  },
  getPrivateSettings: function () {
    var privateSettings = Meteor.settings.private
    return { ...privateSettings }
  }
})
