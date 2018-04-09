import { Components, registerComponent, withDocument, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Contacts from '../../modules/contacts/collection.js';
import moment from 'moment';
import { Link } from 'react-router';
import { Button, Card, CardBody, CardFooter, CardHeader, CardText } from 'reactstrap';

const ContactsProfile = (props) => {
  if (props.loading) {
    return <div className="page contacts-profile"><Components.Loading/></div>
  } else if (!props.document) {
    return <div className="page contacts-profile"><FormattedMessage id="app.404"/></div>
  } else {

    const contact = props.document;
    const DATE_FORMAT_LONG = 'MMMM DD YYYY, h:mm:ss a';
    const displayDate = contact.updatedAt ?
      "Last modified " + moment(contact.updatedAt).format(DATE_FORMAT_LONG) :
      "Created " + moment(contact.createdAt).format(DATE_FORMAT_LONG);
    const createAddress = () => {
      let streetAddress = contact.street1 + "<br/>";
      if (contact.street2 && contact.street2.trim().length > 0) streetAddress += contact.street2 + "<br/>";
      streetAddress += contact.city + ", " + contact.state + "  " + contact.zip
      return {__html: streetAddress};
    }

    return (
      <Card className="card-accent-primary">
        <CardHeader tag="h2">{ contact.displayName }{ Contacts.options.mutations.edit.check(props.currentUser, contact) ?
          <div className="float-right">
            <Button tag={Link} to={`/contacts/${contact.slug}/edit`}>Edit</Button>
          </div> : null}
        </CardHeader>
        <CardBody>
          <CardText dangerouslySetInnerHTML={createAddress()}></CardText>
          <CardText>{ contact.body }</CardText>
        </CardBody>
        <CardFooter>
          <small className="text-muted">{displayDate}</small>


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
