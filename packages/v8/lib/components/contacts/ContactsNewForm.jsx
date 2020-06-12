import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import Contacts from '../../modules/contacts/collection.js'

const ContactsNewForm = ({ closeModal }) =>
  <div className='animated fadeIn'>
    <Components.SmartForm
      collection={Contacts}
      successCallback={document => {
        if (closeModal) {
          closeModal()
        }
      }}
    />
  </div>

registerComponent('ContactsNewForm', ContactsNewForm)
