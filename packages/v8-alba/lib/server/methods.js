import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Connectors } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'

function mapEmailsLocalFunction ({ user }) {
  console.log('Meteor.methods mapEmails:', user.emails)
  if (user.emails && user.emails[0]) {
    const emailAddress = user.emails[0].address
    const emailVerified = user.emails[0].verified
    Meteor.wrapAsync(Connectors.update(Users, user._id, {
      $set: {
        emailAddress,
        emailVerified
      }
    }))
  }
}

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
    var removeSuccess = false
    console.log('Meteor.methods removeEmail:', userId, email)
    try {
      Meteor.wrapAsync(Accounts.removeEmail(userId, email))
      removeSuccess = true
    } catch(error) {
      console.log('removeEmail error:', error)
      removeSuccess = false
      throw new Meteor.Error('remove-error', 'Meteor.methods/removeEmail error.')
    }
    if (removeSuccess) {
      const user = Users.getUser(userId)
      mapEmailsLocalFunction({ user, operator: 'set' })
      return email
    } else {
      return null
    }
  },

  mapEmails ({ user }) {
    console.log('Meteor.methods mapEmails:', user.emails)
    if (user.emails && user.emails[0]) {
      const emailAddress = user.emails[0].address
      const emailVerified = user.emails[0].verified
      Meteor.wrapAsync(Connectors.update(Users, user._id, {
        $set: {
          emailAddress,
          emailVerified
        }
      }))
    }
  },

  mapEmailsCurrentUser () {
    const user = Users.getUser()
    // console.log('Meteor.methods mapEmailsCurrentUser:', user)
    if (user.emails && user.emails[0]) {
      // console.log('current emails:', user.emails)

      const emailAddress = user.emails[0].address
      const emailVerified = user.emails[0].verified

      Meteor.wrapAsync(Connectors.update(Users, user._id, {
        $set: {
          emailAddress,
          emailVerified
        }
      }))
    }
  }
})
