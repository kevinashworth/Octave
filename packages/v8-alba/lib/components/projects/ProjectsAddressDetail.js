import { registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CardText } from 'reactstrap';

class ProjectsAddressDetail extends PureComponent {
  render() {
    const address = this.props.address;
    return (
      <CardText className="mt-1">
        { address.street1 }<br/>
        {address.street2 &&
          <span>{ address.street2 }<br/></span>
        }
        { address.city } { address.state } { address.zip }<br/>
        <small><a href={`https://maps.google.com/?q=${address.street1},${address.city},${address.state}`} target="_maps">Open in Google Maps</a></small>
      </CardText>
    )
  }
}

ProjectsAddressDetail.propTypes = {
  address: PropTypes.shape({
    street1: PropTypes.string.isRequired,
    street2: PropTypes.string,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string,
  }).isRequired
};

registerComponent('ProjectsAddressDetail', ProjectsAddressDetail);
