import { Components, registerComponent, withCurrentUser, withList } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import _ from 'lodash';
import moment from 'moment';
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import Projects from '../../modules/projects/collection.js';

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  defaultSearch: "",
  page: 1,
  sizePerPage: 50,
  sortName: "projectTitle",
  sortOrder: "asc"
};

function dateFormatter(cell, row) {
  return moment(cell).format(DATE_FORMAT_SHORT);
}

class ProjectsDataTable extends PureComponent {
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

    const filteredResults = _.filter(results, function(o) {
      // compare current time to 1 week ago, but generous, so start of day then, not the time it is now - 1 week plus up to 23:59
      const now = moment();
      const dateToCompare = o.updatedAt ? o.updatedAt : o.createdAt;
      const displayThis = moment(dateToCompare).isAfter(now.subtract(14, 'days').startOf('day'))
      // if (updatedAt) {
      //   console.log(updatedAt)
      //   console.log(moment(updatedAt).format(DATE_FORMAT_LONG));
      //   console.log(moment(updatedAt).subtract(14, 'days').startOf('day').format(DATE_FORMAT_LONG));
      // }
      return _.includes(['Casting', 'On Hiatus', 'On Hold', 'See Notes', 'Unknown'], o.status)
          && _.includes(['Feature Film', 'Mod. Low Budget Film', '1/2 Hour'], o.projectType)
          && displayThis;
    });

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-camera"></i>Projects Data Table
            <Components.ProjectFilters/>
          </CardHeader>
          <CardBody>
            <BootstrapTable data={filteredResults} version="4" condensed striped hover pagination search options={this.state.options} selectRow={selectRow} keyField='_id'>
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
              <TableHeaderColumn dataField="updatedAt" dataFormat={ dateFormatter } dataSort>Updated</TableHeaderColumn>
              <TableHeaderColumn dataField="status" dataSort>Status</TableHeaderColumn>
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
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment',
  limit: 1000,
  enableCache: true
};

registerComponent('ProjectsDataTable', ProjectsDataTable, withCurrentUser, [withList, options]);
