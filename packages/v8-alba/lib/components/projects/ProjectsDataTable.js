import React, {Component} from 'react';
import {Card, CardHeader, CardBody} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import ProjectDropdowns from '../../containers/Filter/ProjectDropdowns';
import projects from '../ProjectsTable/_projects';


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
      console.log(`You clicked row ${row.project_id} (${rowIndex}, ${columnIndex}):`);
      console.log(event);
    }

    this.table = projects;
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
        text: 'All', value: projects.length
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
            <i className="fa fa-camera"></i>Projects Data Table
            <ProjectDropdowns></ProjectDropdowns>
          </CardHeader>
          <CardBody>
            <BootstrapTable data={this.table} version="4" condensed striped hover pagination search options={this.options} selectRow={selectRow} keyField='project_id'>
              <TableHeaderColumn dataField="project_title" dataSort>Title</TableHeaderColumn>
              <TableHeaderColumn dataField="project_type" dataSort>Type</TableHeaderColumn>
              <TableHeaderColumn dataField="last_modified" dataSort>Last Modified</TableHeaderColumn>
              <TableHeaderColumn dataField="casting_company" dataSort>Casting</TableHeaderColumn>
              <TableHeaderColumn dataField="status" dataSort>Status</TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default ProjectsDataTable;
