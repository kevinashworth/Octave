import { registerComponent, Components, withList, withCurrentUser } from 'meteor/vulcan:core';
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
import Projects from '../../modules/projects/collection.js';

const ProjectsTable = ({loading, results = [], currentUser}) =>
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-picture-o"></i> ProjectsTable
            <Components.ProjectDropdowns/>
          </CardHeader>
        { loading ?
          <CardBody>
            <Components.Loading />
          </CardBody> :
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
              {results.map(project => <Components.ProjectsRow key={project._id} documentId={project._id} currentUser={currentUser} />)}
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
        }
        </Card>
      </div>

const options = {
  collection: Projects,
  fragmentName: 'ProjectsDetailsFragment',
  limit: 20
};

registerComponent('ProjectsTable', ProjectsTable, withCurrentUser, [withList, options]);
