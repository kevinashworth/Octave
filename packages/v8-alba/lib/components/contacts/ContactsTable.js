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
import Contacts from '../../modules/contacts/collection.js';

const ContactsTable = ({loading, results = [], currentUser}) =>
  <div className="animated fadeIn">
    <Components.AccountsLoginForm />
    <Card>
      <CardHeader>
        <i className="fa fa-align-justify"></i> ContactsTable
        <Components.ContactDropdowns/>
      </CardHeader>
    { loading ?
      <CardBody>
        <Components.Loading />
      </CardBody> :
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
            <th>Edit</th>
          </tr>
          </thead>
          <tbody>
          {results.map(contact => <Components.ContactsRow key={contact._id} documentId={contact._id} currentUser={currentUser} />)}
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
    <Components.ContactsNewForm />
  </div>

const options = {
  collection: Contacts,
  fragmentName: 'ContactsDetailsFragment',
  limit: 20
};

registerComponent('ContactsTable', ContactsTable, withCurrentUser, [withList, options]);
