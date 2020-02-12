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
    Accounts.sendVerificationEmail(id)
  },
  addEmail: function (userId, newEmail) {
    console.log('Meteor.methods addEmail:', userId, newEmail)
    Accounts.addEmail(userId, newEmail)
  },
  mapEmails: function (user) {
    // if (user.emails && user.emails[0]) {
    //   const [...handles] = user.emails
    //   const emailAddress = user.emails[0].address
    //   const emailVerified = user.emails[0].verified
    //   await Connectors.update(Users, user._id, {
    //       $set: {
    //         handles,
    //         emailAddress,
    //         emailVerified
    //       }
    //     })
    // }
    console.log('map emails', user)
  }
})
