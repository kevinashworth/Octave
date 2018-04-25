import { registerComponent } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardText } from 'reactstrap';


// import { Badge, ListGroupItem } from 'reactstrap';

class ProjectsPersonDetail extends Component {
  render() {
    const person = this.props.person;
    return (
      <CardText className="mb-0">
        { person.personnelTitle} <b>{ person.name }</b>
      </CardText>
    )
  }
}

ProjectsPersonDetail.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    personnelId: PropTypes.number.isRequired,
    personnelTitle: PropTypes.string.isRequired,
  })
};

registerComponent('ProjectsPersonDetail', ProjectsPersonDetail);
