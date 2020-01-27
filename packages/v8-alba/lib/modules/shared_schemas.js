import SimpleSchema from 'simpl-schema'
import { ADDRESS_TYPES_ENUM, GROUPED_LOCATIONS_ENUM } from './constants.js'

export const addressSubSchema = new SimpleSchema({
  street1: {
    label: 'Street 1',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  street2: {
    label: 'Street 2',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  city: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  state: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  zip: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  addressType: {
    label: 'Type',
    type: String,
    optional: true,
    input: 'MySelect',
    options: () => {
      return ADDRESS_TYPES_ENUM
    },
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  location: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  }
})

export const contactSubSchema = new SimpleSchema({
  contactId: {
    type: String,
    input: 'SelectContactIdNameTitle',
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    options: props => props.data.contacts.results.map(contact => ({
      value: contact._id,
      label: contact.fullName
    }))
  },
  contactName: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  contactTitle: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  }
})

export const linkSubSchema = new SimpleSchema({
  platformName: {
    label: 'Platform',
    type: String,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  profileName: {
    label: 'Profile Name',
    type: String,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  profileLink: {
    label: 'Profile Link',
    type: String,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  }
})

export const officeSubSchema = new SimpleSchema({
  castingLocation: {
    label: 'Casting Location',
    type: String,
    optional: true,
    input: 'MyDatalist',
    options: () => {
      return GROUPED_LOCATIONS_ENUM
    },
    canRead: ['guests'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins']
  },
  castingOfficeId: {
    label: 'Casting Office',
    type: String,
    input: 'MySelect',
    optional: true,
    canRead: ['members'],
    canCreate: ['members', 'admins'],
    canUpdate: ['members', 'admins'],
    options: props => props.data.offices.results.map(office => ({
      value: office._id,
      label: office.displayName
    })),
    resolveAs: {
      fieldName: 'castingOffice',
      type: 'Office',
      resolver: (o, args, { Offices }) =>
        o.castingOfficeId && Offices.loader.load(o.castingOfficeId),
      addOriginalField: true
    }
  },
  // contacts: {
  //   label: 'Contacts',
  //   type: Array,
  //   optional: true,
  //   canRead: ['members'],
  //   canCreate: ['members', 'admins'],
  //   canUpdate: ['members', 'admins'],
  //   query: `
  //     contacts{
  //       results{
  //         _id
  //         fullName
  //       }
  //     }
  //   `,
  // },
  // 'contacts.$': {
  //   type: contactSubSchema
  // },
})
