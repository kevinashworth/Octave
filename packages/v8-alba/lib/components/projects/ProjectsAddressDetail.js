import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import { CardText } from 'reactstrap';

class ProjectsAddressDetail extends React.Component {
  render() {
    const address = this.props.address;

    if (address.street1) {
      return (
        <CardText className="mt-1">
          { address.street1 }<br/>
          {address.street2.length > 0 &&
            <span>{ address.street2 }<br/></span>
          }
          { address.city } { address.state } { address.zip }<br/>
          <small><a href={`https://maps.google.com/?q=${address.street1},${address.city},${address.state}`}>Open in Google Maps</a></small>
        </CardText>
      )
    } else {
      return (<div>No address yet.</div>);
    }
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
