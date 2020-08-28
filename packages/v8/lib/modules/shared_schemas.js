import SimpleSchema from 'simpl-schema'
import { ADDRESS_TYPES_ENUM, GROUPED_LOCATIONS_ENUM, PHONE_NUMBER_TYPES_ENUM } from './constants.js'

export const addressSubSchema = new SimpleSchema({
  street1: {
    label: 'Street 1',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  street2: {
    label: 'Street 2',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  city: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  state: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  zip: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  addressType: {
    label: 'Type',
    type: String,
    optional: true,
    input: 'MySelect',
    options: ADDRESS_TYPES_ENUM,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  location: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  }
})

export const contactSubSchema = new SimpleSchema({
  contactId: {
    type: String,
    input: 'SelectContactIdNameTitle',
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins'],
    options: props => props.data.contacts.results.map(contact => ({
      value: contact._id,
      label: contact.displayName
    }))
  },
  contactName: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  contactTitle: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  }
})

export const linkSubSchema = new SimpleSchema({
  platformName: {
    label: 'Platform',
    type: String,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  profileName: {
    label: 'Profile Name',
    type: String,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  profileLink: {
    label: 'Profile Link',
    type: String,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins'],
    inputProperties: {
      placeholder: 'https://'
    }
  }
})

export const officeSubSchema = new SimpleSchema({
  officeId: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins'],
    input: 'MySelect',
    options: props => props.data.offices.results.map(office => ({
      value: office._id,
      label: office.displayName
    }))
  },
  officeLocation: {
    label: 'Office Location',
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['admins'],
    canUpdate: ['admins'],
    input: 'MyDatalist',
    options: GROUPED_LOCATIONS_ENUM
  },
  officeName: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  }
})

export const phoneSubSchema = new SimpleSchema({
  phoneNumberAsInput: {
    type: String,
    label: 'Phone Number',
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  phoneNumberType: {
    type: String,
    label: 'Phone Type',
    optional: true,
    input: 'MySelect',
    options: PHONE_NUMBER_TYPES_ENUM,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  phoneNumber: { // validated and formatted by Twilio
    type: String,
    hidden: true,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  nationalFormat: { // validated and formatted by Twilio
    type: String,
    hidden: true,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  },
  countryCode: { // from Twilio
    type: String,
    hidden: true,
    optional: true,
    canRead: ['members'],
    canCreate: ['admins'],
    canUpdate: ['admins']
  }
})
