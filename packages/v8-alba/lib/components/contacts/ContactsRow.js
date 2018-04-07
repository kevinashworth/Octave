import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';

import Contacts from '../../modules/contacts/collection.js';

const ContactsRow = ({contact, currentUser}) =>
  <tr>
    <td>{contact.displayName}</td>
    <td>{contact.street1}</td>
    <td>{contact.street2}</td>
    <td>{contact.city}</td>
    <td>{contact.state}</td>
    <td>{contact.zip}</td>
    <td>{Contacts.options.mutations.edit.check(currentUser, contact) ?
      <Components.ModalTrigger label="Edit">
        <Components.Modals currentUser={currentUser} documentId={contact._id} />
      </Components.ModalTrigger>
      : null
    }</td>
  </tr>

registerComponent('ContactsRow', ContactsRow);
