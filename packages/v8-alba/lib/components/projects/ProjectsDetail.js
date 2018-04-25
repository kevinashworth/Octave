import { Components, registerComponent, withDocument, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, CardHeader, CardLink, CardText } from 'reactstrap';
import moment from 'moment';
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import Projects from '../../modules/projects/collection.js';

class ProjectsDetail extends React.Component {
  render() {
    if (this.props.loading) {
      return <div><Components.Loading/></div>
    } else if (!this.props.document) {
      return <div><Components.FormattedMessage id="app.404"/></div>
    } else {

    const project = this.props.document;
    const displayDate = project.updatedAt ?
      "Last modified " + moment(project.updatedAt).format(DATE_FORMAT_LONG) :
      "Created " + moment(project.createdAt).format(DATE_FORMAT_LONG);

    return (
      <Card className="card-accent-primary">
        <CardHeader tag="h2">{ project.projectTitle }</CardHeader>
        <CardBody>
          <CardText className="mb-1">{ project.projectType } {project.network &&
            <span>
            ({ project.network })
            </span>
          }</CardText>
          <CardText>{ project.union }</CardText>
          <CardText className="mb-1">{ project.logline }</CardText>
          <CardText className="mb-1">{ project.notes }</CardText>
          {project.website &&
          <CardText>
            <CardLink href={project.website}>Open official website</CardLink>
          </CardText>
          }
        </CardBody>
        <CardBody>
          <CardText className="mb-0">
            <b>{ project.castingCompany }</b>
          </CardText>
          {project.personnel.map(person => <Components.ProjectsPersonDetail key={person.personnelId} person={person} />)}
          <Components.ProjectsAddressDetail address={project.address}/>
        </CardBody>
        <CardFooter>{displayDate}</CardFooter>
      </Card>
    );
  }}
}

const options = {
  collection: Projects,
  queryName: 'projectsSingleQuery',
  fragmentName: 'ProjectsDetailsFragment',
};

registerComponent('ProjectsDetail', ProjectsDetail, withCurrentUser, [withDocument, options]);
