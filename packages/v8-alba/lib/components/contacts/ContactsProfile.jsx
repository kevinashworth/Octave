import { Components, registerComponent, withDocument, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Contacts from '../../modules/contacts/collection.js';
import moment from 'moment';
// import { Link } from 'react-router';
import { Card, CardBody, CardFooter, CardHeader, CardText } from 'reactstrap';

const ContactsProfile = (props) => {
  if (props.loading) {

    return <div className="page contacts-profile"><Components.Loading/></div>

  } else if (!props.document) {

    console.log(`// missing contact (_id/slug: ${props.contactId || props.slug})`);
    return <div className="page contacts-profile"><FormattedMessage id="app.404"/></div>

  } else {

    const DATE_FORMAT_LONG = 'MMMM DD YYYY, h:mm:ss a';
    // const contact = Contacts.findOne(c._id);
    const contact = props.document;

    return (
      <Card className="card-accent-primary">
        <CardHeader tag="h2">{ contact.displayName }</CardHeader>
        <CardBody>
          {/* <CardTitle>{ contact.project_title }</CardTitle> */}
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
    )
  }
}

ContactsProfile.propTypes = {
  // document: PropTypes.object.isRequired,
}

const options = {
  collection: Contacts,
  queryName: 'contactsSingleQuery',
  fragmentName: 'ContactsDetailsFragment',
};

registerComponent('ContactsProfile', ContactsProfile, withCurrentUser, [withDocument, options]);
