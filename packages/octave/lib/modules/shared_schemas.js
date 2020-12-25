import { Components, createSchema } from 'meteor/vulcan:core'
import React, { lazy, Suspense } from 'react'
import get from 'lodash/get'
import { ADDRESS_TYPES_ENUM, GROUPED_LOCATIONS_ENUM, FLAT_LOCATIONS_ENUM, GROUPED_LINK_PLATFORMS_ENUM, FLAT_LINK_PLATFORMS_ENUM, PHONE_NUMBER_TYPES_ENUM } from './constants.js'

const MyCreatableSelect = lazy(() => import('../components/common/Forms/MyCreatableSelect'))
const MySelect = lazy(() => import('../components/common/Forms/MySelect'))
const SelectContactIdNameTitle = lazy(() => import('../components/common/Forms/SelectContactIdNameTitle'))
const MyCreatableSelectLazy = (props) => {
  return (
    <Suspense fallback={<Components.Loading />}>
      <MyCreatableSelect {...props} />
    </Suspense>
  )
}
const MySelectLazy = (props) => {
  return (
    <Suspense fallback={<Components.Loading />}>
      <MySelect {...props} />
    </Suspense>
  )
}
const SelectContactIdNameTitleLazy = (props) => {
  return (
    <Suspense fallback={<Components.Loading />}>
      <SelectContactIdNameTitle {...props} />
    </Suspense>
  )
}

export const addressSubSchema = createSchema({
  street1: {
    label: 'Street 1',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  street2: {
    label: 'Street 2',
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  city: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  state: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  zip: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  addressType: {
    label: 'Type',
    type: String,
    optional: true,
    input: MySelectLazy,
    options: ADDRESS_TYPES_ENUM,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  location: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  }
})

export const contactSubSchema = createSchema({
  contactId: {
    type: String,
    input: SelectContactIdNameTitleLazy,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
    options: props => get(props, 'data.contacts.results', []).map(contact => ({
      value: contact._id,
      label: contact.displayName
    }))
  },
  contactName: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  contactTitle: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  }
})

export const linkSubSchema = createSchema({
  platformName: {
    label: 'Platform',
    type: String,
    input: MyCreatableSelectLazy,
    options: GROUPED_LINK_PLATFORMS_ENUM,
    itemProperties: {
      flattenedOptions: FLAT_LINK_PLATFORMS_ENUM
    },
    placeholder: 'Type or Select…',
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  profileName: {
    label: 'Profile Name',
    type: String,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  profileLink: {
    label: 'Profile Link',
    type: String,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
    inputProperties: {
      placeholder: 'https://'
    }
  }
})

export const officeSubSchema = createSchema({
  officeId: {
    type: String,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins'],
    input: MySelectLazy,
    options: props => get(props, 'data.offices.results', []).map(office => ({
      value: office._id,
      label: office.displayName
    }))
  },
  officeLocation: {
    label: 'Office Location',
    type: String,
    optional: true,
    input: MyCreatableSelectLazy,
    options: GROUPED_LOCATIONS_ENUM,
    itemProperties: {
      flattenedOptions: FLAT_LOCATIONS_ENUM
    },
    placeholder: 'Type or Select…',
    canRead: ['guests'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  officeName: {
    type: String,
    optional: true,
    hidden: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  }
})

export const phoneSubSchema = createSchema({
  phoneNumberAsInput: {
    type: String,
    label: 'Phone Number',
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  phoneNumberType: {
    type: String,
    label: 'Phone Type',
    optional: true,
    input: MySelectLazy,
    options: PHONE_NUMBER_TYPES_ENUM,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  phoneNumber: { // validated and formatted by Twilio
    type: String,
    hidden: true,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  nationalFormat: { // validated and formatted by Twilio
    type: String,
    hidden: true,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  },
  countryCode: { // from Twilio
    type: String,
    hidden: true,
    optional: true,
    canRead: ['members'],
    canCreate: ['editors', 'admins'],
    canUpdate: ['editors', 'admins']
  }
})
