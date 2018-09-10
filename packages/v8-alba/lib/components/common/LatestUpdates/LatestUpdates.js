import { Components, registerComponent, withMulti } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap';
import Contacts from '../../../modules/contacts/collection.js';
import Projects from '../../../modules/projects/collection.js';
import moment from 'moment';
import { DATE_FORMAT_SHORT_FRIENDLY } from '../../../modules/constants.js'

class LatestContactUpdates extends Component {
  render() {
    if (this.props.loading) {
      return (<div><Components.Loading/></div>);
    }

    return (
      <Row>
        {this.props.results.map(contact =>
          <Col xs="12" sm="6" md="4" key={contact._id}>
            <Card className="card-accent-warning">
              <CardHeader>
                <b><Link to={`/contacts/${contact._id}/${contact.slug}`}>{contact.displayName}</Link></b>
              </CardHeader>
              <CardBody>
                {contact.title}<br/>
                {contact.city}<br/>
                {contact.projects.length === 1 ? `1 project` : `${contact.projects.length} projects`}<br/>
              </CardBody>
              <CardFooter>
                <small className="text-muted">Contact updated {moment(contact.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)}</small>
              </CardFooter>
            </Card>
          </Col>
        )}
      </Row>
    )
  }
}

const contactOptions = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment',
  limit: 6
};

registerComponent('LatestContactUpdates', LatestContactUpdates, [withMulti, contactOptions]);

class LatestProjectUpdates extends Component {
  render() {
    if (this.props.loading) {
      return (<div><Components.Loading/></div>);
    }

    return (
      <Row>
        {this.props.results.map(project =>
          <Col xs="12" sm="6" md="4" key={project._id}>
            <Card className="card-accent-danger">
              <CardHeader>
                <b><Link to={`/projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></b>
              </CardHeader>
              <CardBody>
                {project.projectType}<br/>
                {project.status}<br/>
                {project.castingCompany}<br/>
              </CardBody>
              <CardFooter>
                <small className="text-muted">Project updated {moment(project.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)}</small>
              </CardFooter>
            </Card>
          </Col>
        )}
        <Col xs="12" sm="6" md="4">
          <Card className="card-accent-danger">
            <CardHeader>
            <b><Link to ={`/projects/ie8bTLRHNXDTHb5Y8/dwight-in-shining-armor`}>Dwight in Shining Armor</Link></b>
            </CardHeader>
            <CardBody>
              TV 1/2 Hour • BYUtv
              Casting<br/>
              Shoots in and around Salt Lake City, Utah<br/>
              Doro / Sherwood Casting<br/>
              Casting Director <b><Link to={`/contacts/tug6LvbQzypBbaKH9/nickole-doro`}>Nickole Doro</Link></b><br/>
              No address yet. HELP!<br/>
            </CardBody>
            <CardFooter>
              <small className="text-muted"><b>New!</b> Project added Aug 28</small>
            </CardFooter>
          </Card>
        </Col>
        <Col xs="12" sm="6" md="4">
          <Card className="card-accent-danger">
            <CardHeader>
            <b><Link to={`/projects/Sgsmc4S32AybDdRbA/politician-the`}>Politician, The</Link></b>
            </CardHeader>
            <CardBody>
              TV One Hour • Netflix
              Casting<br/>
              Alexa L. Fogel Casting<br/>
              5225 Wilshire Blvd<br/>
              Room 419<br/>
              Los Angeles CA 90036
            </CardBody>
            <CardFooter>
              <small className="text-muted"><b>New!</b> Project added Sept 4</small>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    )
  }
}

const projectOptions = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment',
  limit: 4
};

registerComponent('LatestProjectUpdates', LatestProjectUpdates, [withMulti, projectOptions]);


class LatestUpdates extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Components.LatestContactUpdates/>
        <Components.LatestProjectUpdates/>
        <Row>
          <Col xs="12" sm="6" md="4">
            <Card className="card-accent-secondary">
              <CardHeader>
                Canceled Pilot
              </CardHeader>
              <CardBody>
                No longer with us. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                laoreet dolore magna aliquam erat volutpat.
              </CardBody>
              <CardHeader>
                <small className="text-muted">Canceled July 31</small>
              </CardHeader>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="4">
            <Card className="card-accent-secondary">
              <CardHeader>
                Wrapped Pilot
              </CardHeader>
              <CardBody>
                Wrapped, future unknown. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                laoreet dolore magna aliquam erat volutpat.
              </CardBody>
              <CardHeader>
                <small className="text-muted">Wrapped Aug 30</small>
              </CardHeader>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="4">
            <Card className="card-accent-secondary">
              <CardHeader>
                Card title
              </CardHeader>
              <CardBody>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="4">
            <Card className="card-accent-secondary">
              <CardHeader>
                Card title
              </CardHeader>
              <CardBody>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="4">
            <Card className="card-accent-secondary">
              <CardHeader>
                Card title
              </CardHeader>
              <CardBody>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

registerComponent('LatestUpdates', LatestUpdates);
