import Papa from 'papaparse'
import axios from 'axios'
import { upload } from './seeds/helpers.js'

const key = encodeURIComponent('8631d820')
const contactsSchema = require('./seeds/contacts.schema.json')
const officesSchema = require('./seeds/offices.schema.json')
const projectsSchema = require('./seeds/projects.schema.json')
const pastProjectsSchema = require('./seeds/pastprojects.schema.json')
const statisticsSchema = require('./seeds/statistics.schema.json')

// URL to 'generate' CSV files
const urlToGenerateData = (schema) => {
  return 'https://api.mockaroo.com/api/generate.' + schema.file_format +
    '?key=' + key +
    '&count=' + schema.num_rows +
    '&fields=' + encodeURIComponent(JSON.stringify(schema.columns))
}

async function getContacts () {
  try {
    var response = await axios.post(urlToGenerateData(contactsSchema))
    const responseOK = response && response.status === 200 && response.statusText === 'OK'
    if (responseOK) {
      const contactsCSV = await response.data
      // console.log('contactsCSV:')
      // console.dir(contactsCSV)
      var contactsJSON = Papa.parse(contactsCSV, {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true
      }).data
      // console.log('contactsJSON:')
      // console.dir(contactsJSON)
      await upload('contacts', contactsCSV)
      return contactsJSON
    }
  } catch (err) {
    console.error(err)
  }
}

async function getOffices () {
  try {
    var response = await axios.post(urlToGenerateData(officesSchema))
    const responseOK = response && response.status === 200 && response.statusText === 'OK'
    if (responseOK) {
      const officesCSV = await response.data
      var officesJSON = Papa.parse(officesCSV, {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true
      }).data
      await upload('offices', officesCSV)
      return officesJSON
    }
  } catch (err) {
    console.error(err)
  }
}

async function getProjects () {
  try {
    var response = await axios.post(urlToGenerateData(projectsSchema))
    const responseOK = response && response.status === 200 && response.statusText === 'OK'
    if (responseOK) {
      const projectsJSON = await response.data
      return projectsJSON
    }
  } catch (err) {
    console.error(err)
  }
}

async function getPastProjects () {
  try {
    var response = await axios.post(urlToGenerateData(pastProjectsSchema))
    const responseOK = response && response.status === 200 && response.statusText === 'OK'
    if (responseOK) {
      const projectsJSON = await response.data
      return projectsJSON
    }
  } catch (err) {
    console.error(err)
  }
}

async function getStatistics () {
  try {
    var response = await axios.post(urlToGenerateData(statisticsSchema))
    const responseOK = response && response.status === 200 && response.statusText === 'OK'
    if (responseOK) {
      const projectsJSON = await response.data
      return projectsJSON
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  getContacts,
  getOffices,
  getPastProjects,
  getProjects,
  getStatistics
}
