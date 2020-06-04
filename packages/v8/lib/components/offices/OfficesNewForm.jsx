import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import Offices from '../../modules/offices/collection.js'

const OfficesNewForm = ({ toggle }) =>
  <div className='animated fadeIn'>
    <Components.SmartForm
      collection={Offices}
      successCallback={document => {
        if (toggle) {
          toggle()
        }
      }}
    />
  </div>

registerComponent('OfficesNewForm', OfficesNewForm)
