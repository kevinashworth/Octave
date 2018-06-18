import { Components, registerComponent, withCurrentUser, withList } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Link } from 'react-router'
import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Projects from '../../modules/projects/collection.js';

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  defaultSearch: "",
  sortName: "projectTitle",
  sortOrder: "asc"
};

class ProjectsDataTable extends Component {
  constructor(props) {
    super(props);

    function renderShowsTotal(start, to, total) {
      return (
        <span>
          Showing projects { start } to { to } out of { total } &nbsp;&nbsp;
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
      this.setState((prevState, props) => ({
        options: {...prevState.options, sortName, sortOrder}
      }));
    }

    const searchChangeHandler = (searchText) => {
      if (this.state.options.defaultSearch !== searchText) {
        this.setState((prevState, props) => ({
          options: {...prevState.options, defaultSearch: searchText}
        }));
      }
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
        sizePerPage: 20,
        paginationShowsTotal: renderShowsTotal,
        paginationPosition: 'both',
        onRowClick: rowClickHandler,
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
    keptState.defaultSearch = this.state.options.defaultSearch;
    keptState.sortName = this.state.options.sortName;
    keptState.sortOrder = this.state.options.sortOrder;
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
            <i className="fa fa-camera"></i>Projects Data Table
            <Components.ProjectDropdowns/>
          </CardHeader>
          <CardBody>
            <BootstrapTable data={this.props.results} version="4" condensed striped hover pagination search options={this.state.options} selectRow={selectRow} keyField='_id'>
              <TableHeaderColumn dataField="projectTitle" dataSort dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/projects/${row._id}/${row.slug}`}>
                      {cell}
                    </Link>
                  )
                }
              }>Name</TableHeaderColumn>
              <TableHeaderColumn dataField="projectType" dataSort>Type</TableHeaderColumn>
              <TableHeaderColumn dataField="castingCompany" dataSort>Casting</TableHeaderColumn>
              <TableHeaderColumn dataField="status" dataSort>Status</TableHeaderColumn>
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
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment',
  limit: 1000,
  enableCache: true
};

registerComponent('ProjectsDataTable', ProjectsDataTable, withCurrentUser, [withList, options]);
