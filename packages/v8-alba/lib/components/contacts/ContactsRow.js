import React from 'react';
import PropTypes from 'prop-types';

class ContactsRow extends React.Component {
  render() {
    const contact = this.props.contact;

    return (
      <tr>
        <td>{contact.name}</td>
        <td>{contact.project_title}</td>
        <td>{contact.street1}</td>
        <td>{contact.street2}</td>
        <td>{contact.city}</td>
        <td>{contact.state}</td>
        <td>{contact.zip}</td>
      </tr>

    )
  }
}

ContactsRow.propTypes = {
  contact: PropTypes.object
}

export default ContactsRow;
