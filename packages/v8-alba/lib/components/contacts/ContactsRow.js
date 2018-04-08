import { Components, registerComponent, withDocument, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';

import Contacts from '../../modules/contacts/collection.js';


const ContactsRow = (props) => {
  const contact = props.document;
  return (
    <tr>
      <td><Link to={`/contacts/${contact.slug}`}>{contact.displayName}</Link></td>
      <td>{contact.street1}</td>
      <td>{contact.street2}</td>
      <td>{contact.city}</td>
      <td>{contact.state}</td>
      <td>{contact.zip}</td>
      <td>{Contacts.options.mutations.edit.check(props.currentUser, contact) ?
        <Components.ModalTrigger label="Edit">
          <Components.ContactsEditForm currentUser={props.currentUser} documentId={contact._id} />
        </Components.ModalTrigger>
        : null
      }</td>
    </tr>
  )
}

const options = {
  collection: Contacts,
  queryName: 'contactsSingleQuery',
  fragmentName: 'ContactsDetailsFragment',
};

registerComponent('ContactsRow', ContactsRow, withCurrentUser, [withDocument, options]);
