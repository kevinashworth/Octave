import { registerComponent, Components, withCurrentUser, withList } from 'meteor/vulcan:core';
import React, {Component} from 'react';
import { Link } from 'react-router'
import {Button, Card, CardHeader, CardBody, CardFooter} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Contacts from '../../modules/contacts/collection.js';

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
      // eslint-disable-next-line no-console
      console.log(`You clicked row ${row._id} (${rowIndex}, ${columnIndex}):`);
      // eslint-disable-next-line no-console
      console.log(event);
    }

    // this.table = this.props.results;
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
        text: 'All', value: this.props.totalCount
      } ],
      sizePerPage: 20,
      paginationShowsTotal: renderShowsTotal,
      paginationPosition: 'both',
      onRowClick: rowClickHandler,
    }
  }

  render() {
    const { count, totalCount, results, loadingMore, loadMore } = this.props;
    const selectRow = {
      mode: 'checkbox'
    };
    const hasMore = results && (totalCount > results.length);

    return (
      <div className="animated">
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>Contacts DataTable
            <Components.ContactDropdowns/>
          </CardHeader>
          <CardBody>
            <BootstrapTable data={this.props.results} version="4" condensed striped hover pagination search options={this.options} selectRow={selectRow} keyField='_id'>
              <TableHeaderColumn dataField="fullName" dataSort dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/contacts/${row._id}`}>
                      {cell}
                    </Link>
                  )
                }
              }>Name</TableHeaderColumn>
              <TableHeaderColumn dataField="title" dataSort dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/projects/${row._id}`}>
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
          {hasMore &&
          <CardFooter>
            {loadingMore ?
              <Components.Loading/> :
              <Button onClick={e => {e.preventDefault(); loadMore();}}>Load More ({count}/{totalCount})</Button>
            }
          </CardFooter>
          }
          </CardBody>
        </Card>
      </div>
    );
  }
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsDetailsFragment',
  limit: 150
};

registerComponent('ContactsDataTable', ContactsDataTable, withCurrentUser, [withList, options]);
