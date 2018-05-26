import { registerComponent } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardText } from 'reactstrap';

class OfficesPersonDetail extends Component {
  render() {
    const person = this.props.person;
    return (
      <CardText>
        { person.personnelTitle} <b>{ person.fullName }</b> ({person._id})
      </CardText>
    )
  }
}

OfficesPersonDetail.propTypes = {
  person: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    personnelTitle: PropTypes.string,
  })
};

registerComponent('OfficesPersonDetail', OfficesPersonDetail);
