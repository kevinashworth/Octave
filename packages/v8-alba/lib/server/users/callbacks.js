import { Accounts } from 'meteor/accounts-base'
import { addCallback, Connectors } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'

async function sendVerificationEmail ({ document: user }) {
  Accounts.sendVerificationEmail(user._id);
}

async function mapEmails ({ document: user }) {
  if (user.emails && user.emails[0]) {
    const [...handles] = user.emails
    const emailAddress = user.emails[0].address
    const emailVerified = user.emails[0].verified
    await Connectors.update(Users, user._id, {
        $set: {
          handles,
          emailAddress,
          emailVerified
        }
      })
  }

}

addCallback('user.create.async', sendVerificationEmail)
addCallback('user.update.async', mapEmails)
