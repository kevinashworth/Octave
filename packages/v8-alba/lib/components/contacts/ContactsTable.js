import { registerComponent, Components } from 'meteor/vulcan:core';
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
import contacts from './_contacts.js';

class ContactsTable extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> ContactsTable
          </CardHeader>
          <CardBody>
            <Table hover bordered striped responsive size="sm">
              <thead>
              <tr>
                <th>Name</th>
                <th>Project</th>
                <th>Address</th>
                <th>Address (cont)</th>
                <th>City</th>
                <th>State</th>
                <th>Zip</th>
              </tr>
              </thead>
              <tbody>
              {contacts.map(contact => <Components.ContactsRow key={contact.project_id} contact={contact} />)}
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

registerComponent('ContactsTable', ContactsTable);
