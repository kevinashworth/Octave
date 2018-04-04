import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, CardHeader, CardLink, CardText } from 'reactstrap';
import ProjectsPersonDetail from './ProjectsPersonDetail.js';
import ProjectsAddressDetail from './ProjectsAddressDetail.js';
import moment from 'moment';
import projects from './_projects.js';

class ProjectsDetail extends React.Component {
  render() {
    const DATE_FORMAT_LONG = 'MMMM DD YYYY, h:mm:ss a';
    const project_id = this.props.match.params.project_id;
    const projectNum = parseInt(project_id)
    const project = projects.find(p => p.project_id === projectNum);

    return (
      <Card className="card-accent-primary">
        <CardHeader tag="h2">{ project.project_title }</CardHeader>
        <CardBody>
          <CardText className="mb-1">{ project.project_type } {project.network &&
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
            <b>{ project.casting_company }</b>
          </CardText>
          {project.personnel.map(person => <ProjectsPersonDetail key={person.personnel_id} person={person} />)}
          <ProjectsAddressDetail address={project.address}></ProjectsAddressDetail>
        </CardBody>
        <CardFooter>
          Last modified {moment(String(project.last_modified)).format(DATE_FORMAT_LONG)}
        </CardFooter>
      </Card>
    );
  }
}

ProjectsDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      project_id: PropTypes.string.isRequired
    })
  })
};

export default ProjectsDetail;
