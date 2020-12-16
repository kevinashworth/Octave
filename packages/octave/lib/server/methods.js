import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import algoliasearch from 'algoliasearch'
import log from 'loglevel'
import { getProcessMongo } from './helpers.js'

Meteor.methods({

  deleteAlgoliaRecord (objectId) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const deletekey = Meteor.settings.private.algolia.DeleteAPIKey
    const client = algoliasearch(applicationid, deletekey)
    const index = client.initIndex(algoliaindex)
    index.deleteObject(objectId)
      .then(response => log.debug('Algolia deleteObject response:', response))
      .catch(error => log.error('Algolia deleteObject error:', error))
  },

  // for when a record is missing or wrong and for this one item we want a re-do
  recreateAlgoliaRecord (indexedObject) {
    const applicationid = Meteor.settings.public.algolia.ApplicationID
    const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
    const addupdatekey = Meteor.settings.private.algolia.AddAndUpdateAPIKey
    const client = algoliasearch(applicationid, addupdatekey)
    const index = client.initIndex(algoliaindex)

    console.log('About to send indexedObject:', indexedObject)

    index
      .saveObject(indexedObject)
      .then(response => { log.debug('recreateAlgoliaRecord response:', response) })
      .catch(error => { log.error('recreateAlgoliaRecord error:', error) })
  },

  getProcessEnvMongoProvider () {
    return getProcessMongo()
  },

  getPrivateSettings () {
    const privateSettings = Meteor.settings.private
    return { ...privateSettings }
  },

  sendVerificationEmail ({ userId, email }) {
    log.debug('sendVerificationEmail ({ userId, email }):', userId, email)
    Accounts.sendVerificationEmail(userId, email)
  },

  // addEmail/removeEmail used together to effectively editEmail
  addEmail ({ userId, newEmail }) {
    log.debug('addEmail ({ userId, newEmail }):', userId, newEmail)
    try {
      Meteor.wrapAsync(Accounts.addEmail(userId, newEmail))
      return newEmail
    } catch (error) {
      log.error('addEmail error:', error)
      throw new Meteor.Error('already-exists', 'Email already exists in the database.')
    }
  },
  removeEmail ({ userId, email }) {
    let removeSuccess = false
    log.debug('removeEmail ({ userId, email }):', userId, email)
    try {
      Meteor.wrapAsync(Accounts.removeEmail(userId, email))
      removeSuccess = true
    } catch (error) {
      log.error('removeEmail error:', error)
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
    let removeSuccess = false
    try {
      Meteor.wrapAsync(Accounts.removeEmail(userId, oldEmail))
      removeSuccess = true
    } catch (error) {
      removeSuccess = false
      throw new Meteor.Error('remove-error', 'Meteor.methods / removeThenAddEmail remove error.')
    }
    if (removeSuccess) {
      let addSuccess = false
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
