import { registerComponent } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { CardText } from 'reactstrap';

class OfficesContactDetail extends Component {
  render() {
    const contact = {
      _id: this.props.contact.value,
      contactName: this.props.contact.label
    }
    return (
      <CardText>
        <b>{ contact.contactName }</b> ({contact._id})
        <Link to={`/contacts/${contact._id}`}>
          {contact.name}
        </Link>
      </CardText>
    )
  }
}

OfficesContactDetail.propTypes = {
  contact: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })
};

registerComponent('OfficesContactDetail', OfficesContactDetail);
