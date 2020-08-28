import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import algoliasearch from 'algoliasearch'
import { getProcessMongo } from './helpers.js'

Meteor.methods({

  deleteAlgoliaRecord (objectId) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const deletekey = Meteor.settings.private.algolia.DeleteAPIKey
    const client = algoliasearch(applicationid, deletekey)
    const index = client.initIndex(algoliaindex)
    index.deleteObject(objectId)
      .then(response => console.log('deleteObject response:', response))
      .catch(error => console.error('deleteObject error:', error))
  },

  getProcessEnvMongoProvider () {
    return getProcessMongo()
  },

  getPrivateSettings () {
    var privateSettings = Meteor.settings.private
    return { ...privateSettings }
  },

  sendVerificationEmail ({ userId, email }) {
    // console.log('sendVerificationEmail userId, email:', userId, email)
    Accounts.sendVerificationEmail(userId, email)
  },

  // only used in conjunction with removeEmail to effectively editEmail
  addEmail ({ userId, newEmail }) {
    // console.log('Meteor.methods addEmail:', userId, newEmail)
    try {
      Meteor.wrapAsync(Accounts.addEmail(userId, newEmail))
      return newEmail
    } catch (error) {
      // console.log('addEmail error:', error)
      throw new Meteor.Error('already-exists', 'Email already exists in the database.')
    }
  },

  // only used in conjunction with addEmail to effectively editEmail
  removeEmail ({ userId, email }) {
    var removeSuccess = false
    // console.log('Meteor.methods removeEmail:', userId, email)
    try {
      Meteor.wrapAsync(Accounts.removeEmail(userId, email))
      removeSuccess = true
    } catch (error) {
      // console.log('removeEmail error:', error)
      removeSuccess = false
      throw new Meteor.Error('remove-error', 'Meteor.methods/removeEmail error.')
      // TODO: if there is an error, make sure to not remove the email
    }
    if (removeSuccess) {
      // const user = Users.getUser(userId)
      // mapEmailsLocalFunction({ user })
      return email
    } else {
      return null
    }
  },

  removeThenAddEmail ({ userId, oldEmail, newEmail }) {
    var removeSuccess = false
    try {
      Meteor.wrapAsync(Accounts.removeEmail(userId, oldEmail))
      removeSuccess = true
    } catch (error) {
      removeSuccess = false
      throw new Meteor.Error('remove-error', 'Meteor.methods / removeThenAddEmail remove error.')
    }
    if (removeSuccess) {
      var addSuccess = false
      try {
        Meteor.wrapAsync(Accounts.addEmail(userId, newEmail))
        addSuccess = true
      } catch (error) {
        addSuccess = false
        throw new Meteor.Error('add-error', 'Meteor.methods / removeThenAddEmail add error.')
      }
      if (addSuccess) {
        // const user = Users.getUser(userId)
        // mapEmailsLocalFunction({ user })
        return newEmail
      } else {
        return null
      }
    }
  }

})
