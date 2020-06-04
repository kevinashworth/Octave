import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import Contacts from '../../modules/contacts/collection.js'

const ContactsNewForm = ({ toggle }) =>
  <div className='animated fadeIn'>
    <Components.SmartForm
      collection={Contacts}
      successCallback={document => {
        if (toggle) {
          toggle()
        }
      }}
    />
  </div>

// ContactsNewForm.whyDidYouRender = false

registerComponent('ContactsNewForm', ContactsNewForm)
