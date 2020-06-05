import { Components, registerComponent, withAccess, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import { BootstrapTable, ClearSearchButton, SearchField, TableHeaderColumn } from 'react-bootstrap-table'
import _ from 'lodash'
import moment from 'moment'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import { dateFormatter, renderShowsTotal, titleSortFunc } from '../../modules/helpers.js'
import Projects from '../../modules/projects/collection.js'
import withFilters from '../../modules/hocs/withFilters.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  searchColor: 'btn-secondary',
  options: {
    defaultSearch: '',
    page: 1,
    sizePerPage: 50,
    sortName: 'projectTitle',
    sortOrder: 'asc'
  }
}

const AddButtonFooter = () => {
  return (
    <Card.Footer>
      <Components.ModalTrigger title='New Project' component={<Button>Add a Project</Button>}>
        <Components.ProjectsNewForm />
      </Components.ModalTrigger>
    </Card.Footer>
  )
}

class ProjectsDataTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      project: null,
      options: {
        sortIndicator: true,
        paginationSize: 5,
        hidePageListOnlyOnePage: true,
        prePage: '‹',
        nextPage: '›',
        firstPage: '«',
        lastPage: '»',
        sizePerPageList: [{
          text: '20', value: 20
        }, {
          text: '50', value: 50
        }, {
          text: '100', value: 100
        }, {
          text: 'All', value: this.props.totalCount
        }],
        paginationShowsTotal: renderShowsTotal,
        paginationPosition: 'both',
        onPageChange: this.pageChangeHandler,
        onSizePerPageList: this.sizePerPageListHandler,
        onSortChange: this.sortChangeHandler,
        onSearchChange: this.searchChangeHandler,
        onRowClick: this.rowClickHandler,
        clearSearch: true,
        clearSearchBtn: this.createCustomClearButton,
        searchField: this.createCustomSearchField,
        // Retrieve the last state
        ...keptState.options
      },
      ...keptState.searchColor
    }
  }

  componentWillUnmount () {
    // Remember state for the next mount
    const { options } = this.state
    keptState = {
      searchColor: options.searchColor,
      options: {
        defaultSearch: options.defaultSearch,
        page: options.page,
        sizePerPage: options.sizePerPage,
        sortName: options.sortName,
        sortOrder: options.sortOrder
      }
    }
  }

  createCustomClearButton = (onClick) => {
    return (
      <ClearSearchButton
        btnContextual={this.state.searchColor}
        className='btn-sm'
        onClick={e => this.handleClearButtonClick(onClick)}
      />
    )
  }

  createCustomSearchField = (props) => {
    if (props.defaultValue.length && this.state.searchColor !== 'btn-danger') {
      this.setState({ searchColor: 'btn-danger' })
    } else if (props.defaultValue.length === 0 && this.state.searchColor !== 'btn-secondary') {
      this.setState({ searchColor: 'btn-secondary' })
    }
    return (
      <SearchField defaultValue={props.defaultValue} />
    )
  }

  handleClearButtonClick = (onClick) => {
    this.setState({ searchColor: 'btn-secondary' })
    onClick()
  }

  handleHide = () => {
    if (this.state.show) {
      this.setState({
        show: !this.state.show
      })
    }
  }

  pageChangeHandler = (page, sizePerPage) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, page, sizePerPage }
    }))
  }

  rowClickHandler = (row, columnIndex, rowIndex, event) => {
    this.setState({
      project: row,
      show: true
    })
  }

  sortChangeHandler = (sortName, sortOrder) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, sortName, sortOrder }
    }))
  }

  searchChangeHandler = (searchText) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, defaultSearch: searchText }
    }))
  }

  sizePerPageListHandler = (sizePerPage) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, sizePerPage }
    }))
  }

  render () {
    const {
      count, currentUser, loadingMore, loadMore, networkStatus, results, totalCount,
      projectTypeFilters, projectStatusFilters, projectUpdatedFilters, projectPlatformFilters
    } = this.props

    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Card className='card-accent-danger'>
            <Card.Header>
              <i className='fa fa-camera' />Projects
            </Card.Header>
            <Card.Body>
              <Components.Loading />
            </Card.Body>
          </Card>
        </div>
      )
    }

    const hasMore = results && (totalCount > results.length)
    var typeFilters = []
    projectTypeFilters.forEach(filter => {
      if (filter.value) { typeFilters.push(filter.projectType) }
    })
    var statusFilters = []
    projectStatusFilters.forEach(filter => {
      if (filter.value) { statusFilters.push(filter.projectStatus) }
    })
    let moment1 = ''
    let moment2 = ''
    projectUpdatedFilters.forEach(filter => {
      if (filter.value) {
        moment1 = filter.moment1
        moment2 = filter.moment2
      }
    })
    var platformFilters = []
    projectPlatformFilters.forEach(filter => {
      if (filter.value) { platformFilters.push(filter.projectPlatform) }
    })

    const filteredResults = _.filter(results, function (o) {
      // compare current time to filter, but generous, so start of day then, not the time it is now - filter plus up to 23:59
      const now = moment()
      const dateToCompare = o.updatedAt ? o.updatedAt : o.createdAt
      const displayThis = moment(dateToCompare).isAfter(now.subtract(moment1, moment2).startOf('day'))
      return _.includes(statusFilters, o.status) &&
          _.includes(typeFilters, o.projectType) &&
          _.includes(platformFilters, o.platformType) &&
          displayThis
    })

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8: Projects' />
        {this.state.project &&
          <Modal show={this.state.show} onHide={this.handleHide}>
            <Modal.Header closeButton>
              <Modal.Title>
                <Link to={`/projects/${this.state.project._id}/${this.state.project.slug}`}>{this.state.project.projectTitle}</Link>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Components.ProjectModal document={this.state.project} />
            </Modal.Body>
          </Modal>}
        <Card className='card-accent-danger'>
          <Card.Header>
            <i className='fa fa-camera' />Projects
            <Components.ProjectFilters />
          </Card.Header>
          <Card.Body>
            <BootstrapTable
              bordered={false}
              condensed
              data={filteredResults}
              hover
              keyField='_id'
              options={{
                ...this.state.options,
                sizePerPageList: SIZE_PER_PAGE_LIST_SEED.concat([{
                  text: 'All', value: this.props.totalCount
                }])
              }}
              pagination
              search
              striped
              version='4'
            >
              <TableHeaderColumn
                dataField='projectTitle'
                dataSort
                dataFormat={(cell, row) => {
                  return (
                    <Link to={`/projects/${row._id}/${row.slug}`}>
                      {cell}
                    </Link>
                  )
                }}
                sortFunc={titleSortFunc}
                width='25%'
              >
                Name
              </TableHeaderColumn>
              <TableHeaderColumn dataField='casting' dataSort>Casting</TableHeaderColumn>
              <TableHeaderColumn dataField='network' dataSort>Network</TableHeaderColumn>
              <TableHeaderColumn dataField='projectType' dataSort>Type</TableHeaderColumn>
              <TableHeaderColumn dataField='status' dataSort width='94px'>Status</TableHeaderColumn>
              <TableHeaderColumn dataField='updatedAt' dataSort dataFormat={dateFormatter} dataAlign='right' width='94px'>Updated</TableHeaderColumn>
              <TableHeaderColumn dataField='summary' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='notes' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='allContactNames' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='allAddresses' hidden>Hidden</TableHeaderColumn>
            </BootstrapTable>
          </Card.Body>
          {hasMore &&
            <Card.Footer>
              {loadingMore
                ? <Components.Loading />
                : <Button onClick={e => { e.preventDefault(); loadMore() }}>Load More ({count}/{totalCount})</Button>}
            </Card.Footer>}
          {Users.canCreate({ collection: Projects, user: currentUser }) && <AddButtonFooter />}
        </Card>
      </div>
    )
  }
}

const accessOptions = {
  groups: ['participants', 'admins'],
  redirect: '/welcome/new'
}

const multiOptions = {
  collection: Projects,
  fragmentName: 'ProjectsDataTableFragment',
  limit: 1000
}

registerComponent({
  name: 'ProjectsDataTable',
  component: ProjectsDataTable,
  hocs: [
    [withAccess, accessOptions],
    withCurrentUser,
    withFilters,
    [withMulti, multiOptions]
  ]
})