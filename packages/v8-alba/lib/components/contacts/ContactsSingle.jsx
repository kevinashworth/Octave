import { Components, registerComponent, withCurrentUser, withDocument } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import React from 'react';
import { Link } from 'react-router';
import mapProps from 'recompose/mapProps';
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle } from 'reactstrap';
import moment from 'moment';
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import Contacts from '../../modules/contacts/collection.js';

const ContactsSingle = (props) => {
  if (props.loading) {
    return <div className="page contacts-profile"><Components.Loading/></div>
  } else if (!props.document) {
    return <div className="page contacts-profile"><FormattedMessage id="app.404"/></div>
  } else {

    const contact = props.document;
    const displayDate =
      "Contact added to database " + moment(contact.createdAt).format(DATE_FORMAT_SHORT)  + " / " +
      "Last modified " + moment(contact.updatedAt).format(DATE_FORMAT_LONG);
    const createAddress = () => {
      let streetAddress = "";
      if (contact.street1) {
        streetAddress = contact.street1 + "<br/>";
      }
      if (contact.street2 && contact.street2.trim().length > 0) {
        streetAddress += contact.street2 + "<br/>";
      }
      if (contact.city) {
        streetAddress += contact.city + ", ";
      }
      if (contact.state) {
        streetAddress += contact.state;
      }
      if (contact.zip) {
        streetAddress += "  " + contact.zip;
      }
      if (contact.street1 && contact.city && contact.state) {
        streetAddress += `<br/><small><a href="https://maps.google.com/?q=${contact.street1},${contact.city},${contact.state}" target="_maps">Open in Google Maps</a></small>`;
      }
      return {__html: streetAddress};
    }
    const createAltName = () => {
      let alternateName = "";
      if (contact.firstName) {
        alternateName = contact.firstName;
      }
      if (contact.middleName) {
        alternateName += (" " + contact.middleName);
      }
      if (contact.lastName) {
        alternateName += (" " + contact.lastName);
      }
      if (contact.fullName !== alternateName) {
        alternateName = "aka " + alternateName;
      } else {
        alternateName = null;
      }
      return {__html: alternateName};
    }

    return (
      <div className="animated fadeIn">
      <Components.HeadTags title={`V8 Alba: ${contact.fullName}`} />
      <Card className="card-accent-primary">
        <CardHeader tag="h2">{ contact.fullName }{ Contacts.options.mutations.edit.check(props.currentUser, contact) ?
          <div className="float-right">
            <Button tag={Link} to={`/contacts/${contact._id}/edit`}>Edit</Button>
          </div> : null}
        </CardHeader>
        <CardBody>
          <CardText dangerouslySetInnerHTML={createAltName()}></CardText>
          <CardText>{ contact.title }<br/>{ contact.gender }</CardText>
          <CardText dangerouslySetInnerHTML={createAddress()}></CardText>
          <CardText>{ contact.body }</CardText>
        </CardBody>
        {contact.projects &&
          <CardBody>
            <CardTitle>Projects</CardTitle>
            {contact.projects.map(project =>
              <CardText key={project.projectId}>
                <b><CardLink href={`/projects/${project.projectId}`}>{project.projectTitle}</CardLink></b>
              </CardText>
            )}
          </CardBody>
        }
        {contact.links &&
          <CardBody>
            <CardText>
          {contact.links.map(link =>
            <Button className={`btn-${link.platformName.toLowerCase()} text-white`} key={link.profileLink}>
              <span><CardLink href={link.profileLink} target="_links">{link.profileName}</CardLink></span>
            </Button>)}
            </CardText>
          </CardBody>
        }
        <CardFooter>
          <small className="text-muted">{displayDate}</small>
        </CardFooter>
      </Card>
      </div>
    )
  }
}

ContactsSingle.propTypes = {
  // document: PropTypes.object.isRequired,
}

const options = {
  collection: Contacts,
  queryName: 'contactsSingleQuery',
  fragmentName: 'ContactsSingleFragment',
};

const mapPropsFunction = props => ({...props, documentId: props.params._id, slug: props.params.slug});

registerComponent('ContactsSingle', ContactsSingle, withCurrentUser, mapProps(mapPropsFunction), [withDocument, options]);
