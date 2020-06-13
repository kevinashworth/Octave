// import { Components } from 'meteor/vulcan:core'
import { populateComponentsApp, initializeFragments } from 'meteor/vulcan:lib'
import React from 'react'
import { storiesOf } from '@storybook/react'

// import { userData } from './data-user.js'
// import officeData from './data-office.js'

// import { AddressDetail } from 'v8/lib/components/common/AddressDetail.jsx';
// address={officeData.addresses[0]}
import MyLoading from '../packages/v8/lib/components/common/MyLoading.jsx'
// import 'v8'

initializeFragments()
populateComponentsApp()

storiesOf('V8/MyLoading', module)
  .add('Default', () => (
    <MyLoading />
  ))
  .add('Large', () => (
    <MyLoading height={80} />
  ))
  .add('Variant', () => (
    <MyLoading variant='primary' />
  ))
