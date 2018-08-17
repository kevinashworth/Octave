import { Components, registerComponent, withCurrentUser, withList } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Contacts from '../../modules/contacts/collection.js';

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  defaultSearch: "",
  page: 1,
  sizePerPage: 20,
  sortName: "fullName",
  sortOrder: "asc"
};

class ContactsDataTable extends PureComponent {
  constructor(props) {
    super(props);

    const pageChangeHandler = (page, sizePerPage) => {
      this.setState((prevState) => ({
        options: {...prevState.options, page, sizePerPage}
      }));
    }

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

    const sortChangeHandler = (sortName, sortOrder) => {
      this.setState((prevState) => ({
        options: {...prevState.options, sortName, sortOrder}
      }));
    }

    const searchChangeHandler = (searchText) => {
      this.setState((prevState) => ({
        options: {...prevState.options, defaultSearch: searchText}
      }));
    }

    const sizePerPageListHandler = (sizePerPage) => {
      this.setState((prevState) => ({
        options: {...prevState.options, sizePerPage}
      }));
    }

    this.state = {
      options: {
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
        paginationShowsTotal: renderShowsTotal,
        paginationPosition: 'both',
        onPageChange: pageChangeHandler,
        onRowClick: rowClickHandler,
        onSizePerPageList: sizePerPageListHandler,
        onSortChange: sortChangeHandler,
        onSearchChange: searchChangeHandler,
        clearSearch: true,

        // Retrieve the last state
        ...keptState
      }
    }
  }

  componentWillUnmount() {
    // Remember state for the next mount
    const { options } = this.state;
    keptState = {
      defaultSearch: options.defaultSearch,
      page: options.page,
      sizePerPage: options.sizePerPage,
      sortName: options.sortName,
      sortOrder: options.sortOrder
    };
  }

  render() {
    const { count, totalCount, results, loadingMore, loadMore } = this.props;
    const selectRow = {
      mode: 'checkbox'
    };
    const hasMore = results && (totalCount > results.length);

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>Contacts DataTable
            <Components.ContactDropdowns/>
          </CardHeader>
          <CardBody>
            <BootstrapTable data={this.props.results} version="4" condensed striped hover pagination search options={this.state.options} selectRow={selectRow} keyField='_id'>
              <TableHeaderColumn dataField="fullName" dataSort dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/contacts/${row._id}/${row.slug}`}>
                      {cell}
                    </Link>
                  )
                }
              }>Name</TableHeaderColumn>
              <TableHeaderColumn dataField="title" dataSort>Title</TableHeaderColumn>
              <TableHeaderColumn dataField="street1" dataSort>Address</TableHeaderColumn>
              <TableHeaderColumn dataField="street2">(cont)</TableHeaderColumn>
              <TableHeaderColumn dataField="city" dataSort>City</TableHeaderColumn>
              <TableHeaderColumn dataField="state" dataSort>State</TableHeaderColumn>
              <TableHeaderColumn dataField="zip" dataSort>Zip</TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
          {hasMore &&
          <CardFooter>
            {loadingMore ?
              <Components.Loading/> :
              <Button onClick={e => {e.preventDefault(); loadMore();}}>Load More ({count}/{totalCount})</Button>
            }
          </CardFooter>
          }
        </Card>
      </div>
    );
  }
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment',
  limit: 1000,
  enableCache: true
};

registerComponent('ContactsDataTable', ContactsDataTable, withCurrentUser, [withList, options]);