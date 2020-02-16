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

  sendVerificationEmail ({ userId, email }) {
    console.log('sendVerificationEmail userId, email:', userId, email)
    Accounts.sendVerificationEmail(userId, email)
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

  removeEmail ({ userId, email }) {
    console.log('Meteor.methods removeEmail:', userId, email)
    try {
      Meteor.wrapAsync(Accounts.removeEmail(userId, email))
      return email
    } catch(error) {
      console.log('removeEmail error:', error)
      throw new Meteor.Error('remove-error', 'Meteor.methods/removeEmail error.')
    }
  },

  mapEmails ({ user, operator }) {
    console.log('Meteor.methods mapEmails:', user.emails)
    if (user.emails && user.emails[0]) {
      console.log('current handles:', user.handles)
      const [...handles] = user.emails
      console.log('after $addToset handles:', handles)
      const emailAddress = user.emails[0].address
      const emailVerified = user.emails[0].verified
      if (operator === 'set') {
        Meteor.wrapAsync(Connectors.update(Users, user._id, {
          $set: {
            handles,
            emailAddress,
            emailVerified
          }
        }))
      } else { // default is 'addToSet'
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
  },

  mapEmailsCurrentUser ({ operator }) {
    const user = Users.getUser()
    // console.log('Meteor.methods mapEmailsCurrentUser:', user)
    if (user.emails && user.emails[0]) {
      const [...handles] = user.emails
      // console.log('current emails:', user.emails)
      // console.log('after handles:', handles)

      const emailAddress = user.emails[0].address
      const emailVerified = user.emails[0].verified

      if (operator === 'set') {
        Meteor.wrapAsync(Connectors.update(Users, user._id, {
          $set: {
            handles,
            emailAddress,
            emailVerified
          }
        }))
      } else { // default is 'addToSet'
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
  }
})
