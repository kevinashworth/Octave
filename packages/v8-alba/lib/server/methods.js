import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  getProcessEnvMongoUrl () {
    var mongoURL = process.env.MONGO_URL
    return mongoURL
  },
  getPrivateSettings () {
    var privateSettings = Meteor.settings.private
    return { ...privateSettings }
  },
  sendVerificationEmail (id) {
    console.log('sendVerificationEmail id:', id)
    Accounts.sendVerificationEmail(id)
  },
  addEmail ({ userId, newEmail }) {
    console.log('Meteor.methods addEmail:', userId, newEmail)
    Accounts.addEmail(userId, newEmail)
  },
  mapEmails ({ user }) {
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
    console.log('Meteor.methods mapEmails, user', user)
  }
})
