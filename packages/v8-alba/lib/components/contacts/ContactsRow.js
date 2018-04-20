import { Components, registerComponent, withDocument, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';
import { Button } from 'reactstrap';

import Contacts from '../../modules/contacts/collection.js';

const ContactsRow = ({loading, document, currentUser}) => {
  const contact = document;
  if (loading) {
    return (
      <tr></tr>
    )
  } else {
    return (
      <tr>
        <td><Link to={`/contacts/${contact._id}/${contact.slug}`}>{contact.displayName}</Link></td>
        <td>{contact.street1}</td>
        <td>{contact.street2}</td>
        <td>{contact.city}</td>
        <td>{contact.state}</td>
        <td>{contact.zip}</td>
        <td>{Contacts.options.mutations.edit.check(currentUser, contact) ?
          <Components.MyModalTrigger title="Edit Contact" component={<Button>Edit</Button>}>
            <Components.ContactsEditForm currentUser={currentUser} documentId={contact._id} />
          </Components.MyModalTrigger>
          : null
        }</td>
      </tr>
    )
  }
}

const options = {
  collection: Contacts,
  queryName: 'contactsSingleQuery',
  fragmentName: 'ContactsDetailsFragment',
};

registerComponent('ContactsRow', ContactsRow, withCurrentUser, [withDocument, options]);
