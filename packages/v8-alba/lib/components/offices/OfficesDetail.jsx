import { Components, registerComponent, withCurrentUser, withDocument } from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText } from 'reactstrap';
import moment from 'moment';
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import Offices from '../../modules/offices/collection.js';

class OfficesDetail extends React.Component {
  render() {
    if (this.props.loading) {
      return (<div><Components.Loading/></div>);
    }

    if (!this.props.document) {
      return (<div><Components.FormattedMessage id="app.404"/></div>);
    }

    const office = this.props.document;
    const displayDate = office.updatedAt ?
      "Last modified " + moment(office.updatedAt).format(DATE_FORMAT_LONG) :
      "Created " + moment(office.createdAt).format(DATE_FORMAT_LONG);

    return (
      <div className="animated fadeIn">
      <Components.HeadTags title={`V8 Alba: ${office.displayName}`} />
      <Card className="card-accent-primary">
        <CardHeader tag="h2">{ office.displayName  }{ Offices.options.mutations.edit.check(this.props.currentUser, office) ?
          <div className="float-right">
            <Button tag={Link} to={`/offices/${office._id}/edit`}>Edit</Button>
          </div> : null}
        </CardHeader>

        <CardBody>
          <CardText className="mb-1">{ office.body }</CardText>
        </CardBody>
        <CardBody>
          {office.contacts &&
            office.contacts.map(person => <Components.OfficesPersonDetail key={person.personnelId} person={person} />)
          }
          {office.contactIds}
        </CardBody>
        {office.links &&
          <CardBody>
            <CardText>
          {office.links.map(link =>
            <Button className={`btn-${link.platformName.toLowerCase()} text-white`} key={link.profileLink}>
              <span><CardLink href={link.profileLink} target="_links">{link.profileName}</CardLink></span>
            </Button>)}
            </CardText>
          </CardBody>
        }
        <CardFooter>{displayDate}</CardFooter>
      </Card>
    </div>
    );
  }
}

const options = {
  collection: Offices,
  queryName: 'officesSingleQuery',
  fragmentName: 'OfficesDetailsFragment',
};

registerComponent('OfficesDetail', OfficesDetail, withCurrentUser, [withDocument, options]);
