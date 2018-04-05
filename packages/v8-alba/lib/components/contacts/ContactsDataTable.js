import { registerComponent, Components } from 'meteor/vulcan:core';
import React, {Component} from 'react';
import { Link } from 'react-router'
import {Card, CardHeader, CardBody} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import contacts from './_contacts';

class ContactsDataTable extends Component {
  constructor(props) {
    super(props);

    function renderShowsTotal(start, to, total) {
      return (
        <span>
          Showing contacts { start } to { to } out of { total } &nbsp;&nbsp;
        </span>
      );
    }

    function rowClickHandler(row, columnIndex, rowIndex, event) {
      console.log(`You clicked row ${row.project_id} (${rowIndex}, ${columnIndex}):`);
      console.log(event);
    }

    this.table = contacts;
    this.options = {
      sortIndicator: true,
      paginationSize: 5,
      hidePageListOnlyOnePage: true,
      prePage: 'Prev',
      nextPage: 'Next',
      firstPage: 'First',
      lastPage: 'Last',
      sizePerPageList: [ {
        text: '20', value: 20
      }, {
        text: '50', value: 50
      }, {
        text: '100', value: 100
      }, {
        text: 'All', value: contacts.length
      } ],
      sizePerPage: 20,
      paginationShowsTotal: renderShowsTotal,
      paginationPosition: 'both',
      onRowClick: rowClickHandler,
    }
  }

  render() {
    const selectRow = {
      mode: 'checkbox'
    };
    return (
      <div className="animated">
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>Contacts DataTable
            <Components.ContactDropdowns/>
          </CardHeader>
          <CardBody>
            <BootstrapTable data={this.table} version="4" condensed striped hover pagination search options={this.options} selectRow={selectRow} keyField='project_id'>
              <TableHeaderColumn dataField="name" dataSort dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/contacts/${row.project_id}`}>
                      {cell}
                    </Link>
                  )
                }
              }>Name</TableHeaderColumn>
              <TableHeaderColumn dataField="project_title" dataSort dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/projects/${row.project_id}`}>
                      {cell}
                    </Link>
                  )
                }
              }>Title</TableHeaderColumn>
              <TableHeaderColumn dataField="street1" dataSort>Address</TableHeaderColumn>
              <TableHeaderColumn dataField="street2">(cont)</TableHeaderColumn>
              <TableHeaderColumn dataField="city" dataSort>City</TableHeaderColumn>
              <TableHeaderColumn dataField="state" dataSort>State</TableHeaderColumn>
              <TableHeaderColumn dataField="zip" dataSort>Zip</TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
        </Card>
      </div>
    );
  }
}

registerComponent('ContactsDataTable', ContactsDataTable)
