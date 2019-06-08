import { Components, registerComponent, withCurrentUser, withDocument } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import Contacts from '../../modules/contacts/collection.js'

const ContactsRow = ({ loading, document, currentUser }) => {
  const contact = document
  if (loading) {
    return (
      <tr />
    )
  } else {
    return (
      <tr>
        <td><Link to={`/contacts/${contact._id}/${contact.slug}`}>{contact.fullName}</Link></td>
        <td>{contact.street1}</td>
        <td>{contact.street2}</td>
        <td>{contact.city}</td>
        <td>{contact.state}</td>
        <td>{contact.zip}</td>
        <td>{Contacts.options.mutations.edit.check(currentUser, contact)
          ? <Components.ModalTrigger title='Edit Contact' component={<Button style={{ 'padding': '0' }} color='link'>Edit</Button>}>
            <Components.ContactsEditForm currentUser={currentUser} documentId={contact._id} />
          </Components.ModalTrigger>
          : null
        }</td>
      </tr>
    )
  }
}

const options = {
  collection: Contacts,
  queryName: 'contactsSingleQuery',
  fragmentName: 'ContactsSingleFragment'
}

registerComponent('ContactsRow', ContactsRow, withCurrentUser, [withDocument, options])