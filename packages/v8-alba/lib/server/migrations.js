// see https://guide.meteor.com/collections.html#migrations
import { Utils } from 'meteor/vulcan:core'
import { Migrations } from 'meteor/percolate:migrations'
import Contacts from '../modules/contacts/collection.js'
import Projects from '../modules/projects/collection.js'
import PastProjects from '../modules/past-projects/collection.js'
import Statistics from '../modules/statistics/collection.js'
import { PAST_PROJECT_STATUSES_ARRAY } from '../modules/constants.js'
import moment from 'moment'
import marked from 'marked'
import reducedStats from '../modules/statistics/_stats-reduced.js'
import { getAddress, getFullAddress, getFullNameFromContact } from '../modules/helpers.js'

Migrations.add({
  version: 1,
  name: 'address -> addresses',
  up () {
    Projects.find({ addresses: { $exists: false } }).forEach(project => {
      if (project.address) {
        Projects.update(project._id,
          {
            $addToSet: { addresses: project.address },
            $unset: { address: 1, project_id: 1 }
          })
      }
    })
  },
  down () {
    Projects.find({ address: { $exists: false } }).forEach(project => {
      if (project.addresses && project.addresses[0]) {
        Projects.update(project._id,
          {
            $set: { address: project.addresses[0] },
            $unset: { addresses: 1 }
          })
      }
    })
  }
})

Migrations.add({
  version: 2,
  name: 'updatedAt is empty? set to createdAt',
  up () {
    Projects.find({ updatedAt: { $exists: false } }).forEach(project => {
      if (project.createdAt) {
        Projects.update(project._id,
          {
            $set: { updatedAt: project.createdAt }
          })
      }
    })
  },
  down () {
    Projects.find({ $where: 'this.createdAt.getTime() == this.updatedAt.getTime()' }).forEach(project => {
      if (project.createdAt) {
        Projects.update(project._id,
          {
            $unset: { updatedAt: 1 }
          })
      }
    })
  }
})

Migrations.add({
  version: 3,
  name: 'Better projectType naming',
  up () {
    Projects.find({ projectType: { $eq: 'Ultra Low Budget Film' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Feature Film (ULB)' }
        })
    })
    Projects.find({ projectType: { $eq: 'Mod. Low Budget Film' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Feature Film (MLB)' }
        })
    })
    Projects.find({ projectType: { $eq: 'Low Budget Film' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Feature Film (LB)' }
        })
    })
    Projects.find({ projectType: { $eq: 'One Hour' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'TV One Hour' }
        })
    })
    Projects.find({ projectType: { $eq: '1/2 Hour' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'TV 1/2 Hour' }
        })
    })
    Projects.find({ projectType: { $eq: 'Pilot - One Hour' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Pilot One Hour' }
        })
    })
    Projects.find({ projectType: { $eq: 'Pilot - 1/2 Hour' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Pilot 1/2 Hour' }
        })
    })
    Projects.find({ projectType: { $eq: 'Daytime' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'TV Daytime' }
        })
    })
    Projects.find({ projectType: { $eq: 'Mini-Series' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'TV Mini-Series' }
        })
    })
    Projects.find({ projectType: { $eq: 'Movie for Television' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'TV Movie' }
        })
    })
    Projects.find({ projectType: { $eq: 'Telefilm' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'TV Telefilm' }
        })
    })
    Projects.find({ projectType: { $eq: 'Talk/Variety' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'TV Talk/Variety' }
        })
    })
    Projects.find({ projectType: { $eq: 'Sketch/Improv' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'TV Sketch/Improv' }
        })
    })
  },
  down () {
    Projects.find({ projectType: { $eq: 'Feature Film (ULB)' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Ultra Low Budget Film' }
        })
    })
    Projects.find({ projectType: { $eq: 'Feature Film (MLB)' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Mod. Low Budget Film' }
        })
    })
    Projects.find({ projectType: { $eq: 'Feature Film (LB)' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Low Budget Film' }
        })
    })
    Projects.find({ projectType: { $eq: 'TV One Hour' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'One Hour' }
        })
    })
    Projects.find({ projectType: { $eq: 'TV 1/2 Hour' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: '1/2 Hour' }
        })
    })
    Projects.find({ projectType: { $eq: 'Pilot One Hour' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Pilot - One Hour' }
        })
    })
    Projects.find({ projectType: { $eq: 'Pilot 1/2 Hour' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Pilot - 1/2 Hour' }
        })
    })
    Projects.find({ projectType: { $eq: 'TV Daytime' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Daytime' }
        })
    })
    Projects.find({ projectType: { $eq: 'TV Mini-Series' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Mini-Series' }
        })
    })
    Projects.find({ projectType: { $eq: 'TV Movie' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Movie for Television' }
        })
    })
    Projects.find({ projectType: { $eq: 'TV Telefilm' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Telefilm' }
        })
    })
    Projects.find({ projectType: { $eq: 'TV Talk/Variety' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Talk/Variety' }
        })
    })
    Projects.find({ projectType: { $eq: 'TV Sketch/Improv' } }).forEach(project => {
      Projects.update(project._id,
        {
          $set: { projectType: 'Sketch/Improv' }
        })
    })
  }
})

Migrations.add({
  version: 4,
  name: 'updatedAt is empty? set to createdAt [for Contacts]',
  up () {
    Contacts.find({ updatedAt: { $exists: false } }).forEach(contact => {
      if (contact.createdAt) {
        Contacts.update(contact._id,
          {
            $set: { updatedAt: contact.createdAt }
          })
      }
    })
  },
  down () {
    Contacts.find({ $where: 'this.createdAt.getTime() == this.updatedAt.getTime()' }).forEach(contact => {
      if (contact.createdAt) {
        Contacts.update(contact._id,
          {
            $unset: { updatedAt: 1 }
          })
      }
    })
  }
})

Migrations.add({
  version: 5,
  name: 'displayName missing? set it',
  up () {
    Contacts.find({ displayName: { $exists: false } }).forEach(contact => {
      Contacts.update(contact._id,
        {
          $set: { displayName: getFullNameFromContact(contact) }
        })
    })
  },
  down () {
    Contacts.find({ displayName: { $exists: true } }).forEach(contact => {
      Contacts.update(contact._id,
        {
          $unset: { displayName: 1 }
        })
    })
  }
})

Migrations.add({
  version: 6,
  name: 'address -> addresses for Contacts',
  up () {
    Contacts.find({ addresses: { $exists: false } }).forEach(contact => {
      if (contact.street1) {
        Contacts.update(contact._id,
          {
            $addToSet: { addresses: { street1: contact.street1, street2: contact.street2, city: contact.city, state: contact.state, zip: contact.zip } },
            $unset: { address: 1 }
          })
      }
    })
  },
  down () {
    Contacts.find({ address: { $exists: false } }).forEach(contact => {
      if (contact.addresses && contact.addresses[0]) {
        Contacts.update(contact._id,
          {
            $set: { street1: contact.addresses[0].street1, street2: contact.addresses[0].street2, city: contact.addresses[0].city, state: contact.addresses[0].state, zip: contact.addresses[0].zip },
            $unset: { addresses: 1 }
          })
      }
    })
  }
})

Migrations.add({
  version: 7,
  name: 'Statistics Dates as strings',
  up () {
    const theStats = Statistics.findOne()
    let newStats = {}
    newStats.episodics = theStats.episodics.map((o) => {
      return {
        date: moment(o.date).format('YYYY-MM-DD HH:mm:ss'),
        quantity: o.quantity
      }
    })
    newStats.features = theStats.features.map((o) => {
      return {
        date: moment(o.date).format('YYYY-MM-DD HH:mm:ss'),
        quantity: o.quantity
      }
    })
    newStats.pilots = theStats.pilots.map((o) => {
      return {
        date: moment(o.date).format('YYYY-MM-DD HH:mm:ss'),
        quantity: o.quantity
      }
    })
    newStats.others = theStats.others.map((o) => {
      return {
        date: moment(o.date).format('YYYY-MM-DD HH:mm:ss'),
        quantity: o.quantity
      }
    })
    Statistics.update(theStats._id, {
      $set: newStats
    })
  },
  down () {
    const theStats = Statistics.findOne()
    let newStats = {}
    newStats.episodics = theStats.episodics.map((o) => {
      return {
        date: new Date(o.date),
        quantity: o.quantity
      }
    })
    newStats.features = theStats.features.map((o) => {
      return {
        date: new Date(o.date),
        quantity: o.quantity
      }
    })
    newStats.pilots = theStats.pilots.map((o) => {
      return {
        date: new Date(o.date),
        quantity: o.quantity
      }
    })
    newStats.others = theStats.others.map((o) => {
      return {
        date: new Date(o.date),
        quantity: o.quantity
      }
    })
    Statistics.update(theStats._id, {
      $set: newStats
    })
  }
})

Migrations.add({
  version: 8,
  name: 'Reduce statistics. (There is no undo)',
  up: function () {
    const theStats = Statistics.findOne()
    let newStats = {}
    newStats = reducedStats
    Statistics.update(theStats._id, {
      $set: newStats
    })
  },
  down: function () { /* There is no undoing this one. */ }
})

Migrations.add({
  version: 9,
  name: 'Move past projects into PastProjects. (Currently there is no undo.)',
  up: function () {
    Projects.find({ status: { $in: PAST_PROJECT_STATUSES_ARRAY } }).forEach((project, index) => {
      PastProjects.insert(project)
      Projects.remove(project._id)
    })
  },
  down: function () { /* There is no undoing this one. */ }
})

Migrations.add({
  version: 10,
  name: 'Change logline to summary.',
  up: function () {
    Projects.find({ logline: { $exists: true } }).forEach((project) => {
      const newHtmlSummaryToBeSure = Utils.sanitize(marked('**SUMMARY:** ' + project.logline))
      Projects.update(project._id,
        {
          $set: { summary: project.logline, htmlSummary: newHtmlSummaryToBeSure },
          $unset: { logline: 1, htmlLogline: 1 }
        })
    })
    PastProjects.find({ logline: { $exists: true } }).forEach((project) => {
      const newHtmlSummaryToBeSure = Utils.sanitize(marked('**SUMMARY:** ' + project.logline))
      PastProjects.update(project._id,
        {
          $set: { summary: project.logline, htmlSummary: newHtmlSummaryToBeSure },
          $unset: { logline: 1, htmlLogline: 1 }
        })
    })
  },
  down: function () {
    Projects.find({ summary: { $exists: true } }).forEach((project) => {
      const newHtmlLoglineToBeSure = Utils.sanitize(marked('**LOG LINE:** ' + project.summary))
      Projects.update(project._id,
        {
          $set: { logline: project.summary, htmlLogline: newHtmlLoglineToBeSure },
          $unset: { summary: 1, htmlSummary: 1 }
        })
    })
    PastProjects.find({ summary: { $exists: true } }).forEach((project) => {
      const newHtmlLoglineToBeSure = Utils.sanitize(marked('**LOG LINE:** ' + project.summary))
      PastProjects.update(project._id,
        {
          $set: { logline: project.summary, htmlLogline: newHtmlLoglineToBeSure },
          $unset: { summary: 1, htmlSummary: 1 }
        })
    })
  }
})

Migrations.add({
  version: 11,
  name: 'Add addressString to all contacts; will become an onUpdate calculation.',
  up: function () {
    Contacts.find().forEach((contact) => {
      let addressString = ''
      try {
        addressString = getFullAddress(getAddress({ contact }))
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error in addressString for', contact._id, ':')
        // eslint-disable-next-line no-console
        console.error(e)
      }
      Contacts.update(contact._id,
        {
          $set: { addressString: addressString }
        })
    })
  },
  down: function () { /* There is no undoing this one. */ }
})

Meteor.startup(() => {
  Migrations.migrateTo('11')
})
