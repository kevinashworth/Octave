import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, CardHeader, CardText, CardTitle } from 'reactstrap';
import moment from 'moment';
import contacts from './_contacts.js';

class ContactsDetail extends React.Component {
  render() {
    const DATE_FORMAT_LONG = 'MMMM DD YYYY, h:mm:ss a';
    const project_id = this.props.match.params.project_id;
    const contact = contacts.find(p => p.project_id === project_id);

    return (
      <Card className="card-accent-primary">
        <CardHeader tag="h2">{ contact.name }</CardHeader>
        <CardBody>
          <CardTitle>{ contact.project_title }</CardTitle>
          <CardText>{ contact.street1 }</CardText>
          <CardText></CardText>
          {contact.street2 &&
          <CardText>{ contact.street2 }</CardText>
          }
          <CardText>{ contact.city } { contact.state } { contact.zip }</CardText>
        </CardBody>
        <CardFooter>
          Last modified {moment("2017-05-21 15:28:34").format(DATE_FORMAT_LONG)}
        </CardFooter>
      </Card>
    );
  }
}

ContactsDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      project_id: PropTypes.string.isRequired
    })
  })
};

registerComponent('ContactsDetail', ContactsDetail);
