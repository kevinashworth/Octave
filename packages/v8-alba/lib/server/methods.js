import { Meteor } from 'meteor/meteor'

Meteor.methods({
  getProcessEnvMongoUrl: function () {
    var mongoURL = process.env.MONGO_URL
    return mongoURL
  },
  getPrivateSettings: function () {
    var privateSettings = Meteor.settings.private
    return { ...privateSettings }
  },
  sendVerificationEmail: function (id) {
    console.log('sendVerificationEmail id:', id)
    // console.log('sendVerificationEmail flash:', flash)
    Accounts.sendVerificationEmail(id)
    // flash({ id: 'users.verify_email', type: 'success' })
  }
})
