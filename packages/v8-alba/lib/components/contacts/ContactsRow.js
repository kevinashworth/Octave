import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const ContactsRow = ({contact, currentUser}) =>
  <tr>
    <td>{contact.name}</td>
    <td>{contact.street1}</td>
    <td>{contact.street2}</td>
    <td>{contact.city}</td>
    <td>{contact.state}</td>
    <td>{contact.zip}</td>
  </tr>

registerComponent('ContactsRow', ContactsRow);
