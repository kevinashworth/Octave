import React, {Component} from 'react';
import { CardText } from 'reactstrap';
import PropTypes from 'prop-types';

// import { Badge, ListGroupItem } from 'reactstrap';

class ProjectsPersonDetail extends Component {
  render() {
    const person = this.props.person;
    return (
      <CardText className="mb-0">
        { person.personnel_title} <b>{ person.name }</b>
      </CardText>
    )
  }
}

ProjectsPersonDetail.propTypes = {
  person: PropTypes.shape({
    personnel_title: PropTypes.string,
    name: PropTypes.string.isRequired,
  })
};

export default ProjectsPersonDetail;
