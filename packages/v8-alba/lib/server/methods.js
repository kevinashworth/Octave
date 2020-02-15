import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Connectors } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'

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
    // console.log('Meteor.methods addEmail:', userId, newEmail)
    try {
      Meteor.wrapAsync(Accounts.addEmail(userId, newEmail))
      return newEmail
    } catch(error) {
      // console.log('addEmail error:', error)
      throw new Meteor.Error('already-exists', 'Email already exists in the database.')
    }
  },

  mapEmails ({ user }) {
    console.log('Meteor.methods mapEmails:', user.emails)
    if (user.emails && user.emails[0]) {
      console.log('current handles:', user.handles)
      const [...handles] = user.emails
      console.log('after $addToset handles:', handles)
      const emailAddress = user.emails[0].address
      const emailVerified = user.emails[0].verified
      Meteor.wrapAsync(Connectors.update(Users, user._id, {
        $addToSet: {
          handles: { $each: handles }
        },
        $set: {
          emailAddress,
          emailVerified
        }
      }))
    }
  }
})
