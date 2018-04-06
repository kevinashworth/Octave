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
import Contacts from '../../modules/contacts/collection.js';

const ContactsTable = ({results = [], currentUser}) =>
  <div className="animated fadeIn">
    <Card>
      <CardHeader>
        <i className="fa fa-align-justify"></i> ContactsTable
        <Components.ContactDropdowns/>
      </CardHeader>
      <CardBody>
        <Table hover bordered striped responsive size="sm">
          <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>(cont)</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
          </tr>
          </thead>
          <tbody>
          {results.map(contact => <Components.ContactsRow key={contact._id} contact={contact} currentUser={currentUser} />)}
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

const options = {
  collection: Contacts,
  fragmentName: 'ContactsItemFragment'
};

registerComponent('ContactsTable', ContactsTable);
