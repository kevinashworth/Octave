// import { Components } from 'meteor/vulcan:core'
// import { populateComponentsApp, initializeFragments } from 'meteor/vulcan:lib'
import React from 'react'
import { storiesOf } from '@storybook/react'

import StoryRouter from 'storybook-react-router'
import { linkTo } from '@storybook/addon-links'

// import { userData } from './data-user.js'
import contactData from './data-contact.js'
import officeData from './data-office.js'

// import { AddressDetail } from 'v8/lib/components/common/AddressDetail.jsx';
// address={officeData.addresses[0]}
import AddressDetail from '../packages/v8/lib/components/common/AddressDetail.jsx'
import MyLoading from '../packages/v8/lib/components/common/MyLoading.jsx'
import PhoneDetail from '../packages/v8/lib/components/common/PhoneDetail.jsx'
import ContactMini from '../packages/v8/lib/components/contacts/ContactMini.jsx'
import OfficeMini from '../packages/v8/lib/components/offices/OfficeMini.jsx'
import OfficesSingle from '../packages/v8/lib/components/offices/OfficesSingle.jsx'
// import 'v8'
// import '../packages/v8/lib/client/main.js'

// initializeFragments()
// populateComponentsApp()

// console.log('Components:')
// console.dir(Components)

storiesOf('V8/AddressDetail', module)
  .add('Default', () => (
    <AddressDetail address={officeData.addresses[0]} />
  ))

storiesOf('V8/PhoneDetail', module)
  .add('Default', () => (
    <PhoneDetail phone={officeData.phones[0]} />
  ))

storiesOf('V8/MyLoading', module)
  .add('Default', () => <MyLoading />)
  .add('Large', () => <MyLoading height={80} />)
  .add('Primary Variant', () => <MyLoading variant='primary' />)

storiesOf('V8/Contacts/ContactMini', module)
  .add('Default', () => (
    <ContactMini document={contactData} documentId='KbJXy2kb3LezW7v5q' />
  ))

storiesOf('V8/Offices/OfficeMini', module)
  .add('Default', () => (
    <OfficeMini document={officeData} documentId='DLF5b8mntvgMfpQyf' />
  ))

storiesOf('V8/Offices/OfficesSingle', module)
  .addDecorator(
    StoryRouter({
      '/offices/DLF5b8mntvgMfpQyf/edit': linkTo('Linked stories', 'Edit')
    })
  )
  .add('Default', () => (
    <OfficesSingle document={officeData} documentId='DLF5b8mntvgMfpQyf' match={{ params: { _id: 'DLF5b8mntvgMfpQyf' } }} />
  ))
