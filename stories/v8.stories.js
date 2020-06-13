import { Components } from 'meteor/vulcan:core'
import React from 'react'
import { storiesOf } from '@storybook/react'
import { userData } from './data-user.js'

// import the components
// import { EmailDetail } from 'v8-alba/lib/components/common/EmailDetail.jsx';
import 'v8'

// and then load them in the app so that <Component.Whatever /> is defined
import { populateComponentsApp, initializeFragments } from 'meteor/vulcan:lib'
// we need registered fragments to be initialized because populateComponentsApp will run
// hocs, like withUpdate, that rely on fragments
initializeFragments()
// actually fills the Components object
populateComponentsApp()

storiesOf('V8/EmailDetail', module)
  .add('Default', () => (
    <Components.EmailDetail handle={userData.handles[0]} />
  ))
