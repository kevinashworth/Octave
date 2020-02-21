import { Components, registerComponent, withAccess, withMulti } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { BootstrapTable, ClearSearchButton, SearchField, TableHeaderColumn } from 'react-bootstrap-table'
import _ from 'lodash'
import moment from 'moment'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import { dateFormatter, renderShowsTotal, titleSortFunc } from '../../modules/helpers.js'
import PastProjects from '../../modules/past-projects/collection.js'
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

class PastProjectsDataTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: false,
      project: null,
      options: {
        sortIndicator: true,
        paginationSize: 5,
        hidePageListOnlyOnePage: true,
        prePage: '‹',
        nextPage: '›',
        firstPage: '«',
        lastPage: '»',
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
    this.createCustomClearButton = this.createCustomClearButton.bind(this)
    this.createCustomSearchField = this.createCustomSearchField.bind(this)
    this.pageChangeHandler = this.pageChangeHandler.bind(this)
    this.rowClickHandler = this.rowClickHandler.bind(this)
    this.searchChangeHandler = this.searchChangeHandler.bind(this)
    this.sizePerPageListHandler = this.sizePerPageListHandler.bind(this)
    this.sortChangeHandler = this.toggle.bind(this)
    this.toggle = this.toggle.bind(this)
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

  pageChangeHandler = (page, sizePerPage) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, page, sizePerPage }
    }))
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

  createCustomClearButton = (onClick) => {
    return (
      <ClearSearchButton className='btn-sm'
        btnContextual={this.state.searchColor}
        onClick={e => this.handleClearButtonClick(onClick)} />
    )
  }

  toggle () {
    this.setState({
      modal: !this.state.modal
    })
  }

  rowClickHandler = (row, columnIndex, rowIndex, event) => {
    this.setState({ project: row })
    this.setState({ modal: true })
  }

  render () {
    const { count, totalCount, results, loadingMore, loadMore, networkStatus,
            pastProjectTypeFilters, pastProjectStatusFilters, pastProjectUpdatedFilters } = this.props

    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Card className='card-accent-secondary'>
            <CardHeader>
              <i className='fa fa-camera-retro' />Past Projects
            </CardHeader>
            <CardBody>
              <Components.Loading />
            </CardBody>
          </Card>
        </div>
      )
    }

    const hasMore = results && (totalCount > results.length)
    let typeFilters = []
    pastProjectTypeFilters.forEach(filter => {
      if (filter.value) { typeFilters.push(filter.projectType) }
    })
    let statusFilters = []
    pastProjectStatusFilters.forEach(filter => {
      if (filter.value) { statusFilters.push(filter.pastProjectStatus) }
    })
    let moment1 = ''
    let moment2 = ''
    pastProjectUpdatedFilters.forEach(filter => {
      if (filter.value) {
        moment1 = filter.moment1
        moment2 = filter.moment2
      }
    })

    const filteredResults = _.filter(results, function (o) {
      // compare current time to filter, but generous, so start of day then, not the time it is now - filter plus up to 23:59
      const now = moment()
      const dateToCompare = o.updatedAt ? o.updatedAt : o.createdAt
      const displayThis = moment(dateToCompare).isAfter(now.subtract(moment1, moment2).startOf('day'))
      return _.includes(statusFilters, o.status) &&
          _.includes(typeFilters, o.projectType) &&
          displayThis
    })

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Past Projects' />
        <Modal isOpen={this.state.modal} toggle={this.toggle} modalTransition={{ timeout: 100 }}>
          {this.state.project
            ? <ModalHeader toggle={this.toggle}>
              <Link to={`/past-projects/${this.state.project._id}/${this.state.project.slug}`}>{this.state.project.projectTitle}</Link>
            </ModalHeader>
            : null
          }
          <ModalBody>
            <Components.ProjectModal document={this.state.project} />
          </ModalBody>
        </Modal>
        <Card className='card-accent-secondary'>
          <CardHeader>
            <i className='fa fa-camera-retro' />Past Projects
            <Components.PastProjectFilters />
          </CardHeader>
          <CardBody>
            <BootstrapTable condensed hover pagination search striped
              data={filteredResults}
              bordered={false} keyField='_id'
              options={{
                ...this.state.options,
                sizePerPageList: SIZE_PER_PAGE_LIST_SEED.concat([{
                  text: 'All', value: this.props.totalCount
                }])}}
              version='4'>
              <TableHeaderColumn dataField='projectTitle' dataSort sortFunc={titleSortFunc} dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/past-projects/${row._id}/${row.slug}`}>
                      {cell}
                    </Link>
                  )
                }
              } width='25%'>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='casting' dataSort>Casting</TableHeaderColumn>
              <TableHeaderColumn dataField='projectType' dataSort>Type</TableHeaderColumn>
              <TableHeaderColumn dataField='status' dataSort width='94px'>Status</TableHeaderColumn>
                <TableHeaderColumn dataField='updatedAt' dataSort dataFormat={dateFormatter}
                  dataAlign='right' width='94px'>Updated</TableHeaderColumn>
              <TableHeaderColumn dataField='summary' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='notes' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='allContactNames' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='allAddresses' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='network' hidden>Hidden</TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
          {hasMore &&
          <CardFooter>
            {loadingMore
              ? <Components.Loading />
              : <Button onClick={e => { e.preventDefault(); loadMore() }}>Load More ({count}/{totalCount})</Button>
            }
          </CardFooter>
          }
        </Card>
      </div>
    )
  }
}

const accessOptions = {
  groups: ['members', 'admins'],
  redirect: '/login'
}

const multiOptions = {
  collection: PastProjects,
  fragmentName: 'PastProjectsDataTableFragment',
  limit: 500
}

registerComponent( {
  name: 'PastProjectsDataTable',
  component: PastProjectsDataTable,
  hocs: [
    [withAccess, accessOptions],
    withFilters,
    [withMulti, multiOptions]
  ]
})
