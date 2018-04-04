import React, {Component} from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';
import ProjectDropdowns from '../../containers/Filter/ProjectDropdowns';
import ProjectsRow from './ProjectsRow.js';
import projects from './_projects.js';

class ProjectsTable extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-picture-o"></i> ProjectsTable
            <ProjectDropdowns></ProjectDropdowns>
          </CardHeader>
          <CardBody>
            <Table hover bordered striped responsive size="sm">
              <thead>
              <tr>
                <th>Project</th>
                <th>Type</th>
                <th>Last updated</th>
                <th>Casting</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              {projects.map(project => <ProjectsRow key={project.project_id} project={project} />)}
              </tbody>
            </Table>
            <nav>
              <Pagination>
                <PaginationItem><PaginationLink previous href="#">Prev</PaginationLink></PaginationItem>
                <PaginationItem active>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink next href="#">Next</PaginationLink></PaginationItem>
              </Pagination>
            </nav>
          </CardBody>
        </Card>
      </div>

    )
  }
}

export default ProjectsTable;
