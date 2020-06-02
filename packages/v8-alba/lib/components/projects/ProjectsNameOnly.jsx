import { Components, registerComponent, withAccess, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
// import { Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import { BootstrapTable, ClearSearchButton, SearchField, SizePerPageDropDown, TableHeaderColumn } from 'react-bootstrap-table'
import _ from 'lodash'
import moment from 'moment'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import Projects from '../../modules/projects/collection.js'
import withFilters from '../../modules/hocs/withFilters.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  filtersVariant: 'outline-primary',
  searchColor: 'btn-secondary',
  options: {
    defaultSearch: '',
    page: 1,
    sizePerPage: null,
    sortOrder: 'desc'
  }
}

class ProjectsNameOnly extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      filtersVariant: keptState.filtersVariant,
      searchColor: keptState.searchColor,
      modalIsOpen: false,
      options: {
        sortIndicator: true,
        paginationSize: 4,
        hidePageListOnlyOnePage: true,
        prePage: '‹',
        nextPage: '›',
        firstPage: '«',
        lastPage: '»',
        paginationShowsTotal: this.renderShowsTotal,
        paginationPosition: 'bottom',
        onPageChange: this.pageChangeHandler,
        onSizePerPageList: this.sizePerPageListHandler,
        sizePerPageDropDown: this.renderSizePerPageDropDown,
        onSearchChange: this.searchChangeHandler,
        clearSearch: true,
        clearSearchBtn: this.createCustomClearButton,
        searchField: this.createCustomSearchField,
        btnGroup: () => { return null },
        ...keptState.options
      }
    }
    this.toggle = this.toggle.bind(this)
    this.setProjectFiltersRef = this.setProjectFiltersRef.bind(this)
  }

  componentWillUnmount () {
    const { filtersVariant, options, searchColor } = this.state
    keptState = {
      filtersVariant,
      searchColor,
      options: {
        defaultSearch: options.defaultSearch,
        page: options.page,
        sizePerPage: options.sizePerPage ? options.sizePerPage : null,
        sortOrder: options.sortOrder
      }
    }
  }

  createCustomClearButton = (onClick) => {
    return (
      <ClearSearchButton
        className='btn-sm'
        btnContextual={this.state.searchColor}
        onClick={e => this.handleClearButtonClick(onClick)}
      />
    )
  }

  createCustomSearchField = (props) => {
    if (props.defaultValue.length) {
      this.setState({ searchColor: 'btn-danger' })
    } else {
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
      this.toggle()
    }
  }

  handleShow = () => {
    if (!this.state.show) {
      this.toggle()
    }
  }

  pageChangeHandler = (page, sizePerPage) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, page, sizePerPage }
    }))
  }

  renderShowsTotal = (start, to, total) => {
    return (
      <span className='mr-2'>
        Showing {start} to {to} out of {total}
      </span>
    )
  }

  renderSizePerPageDropDown = (props) => {
    return (
      <SizePerPageDropDown btnContextual='btn-secondary btn-sm' {...props} />
    )
  }

  searchChangeHandler = (searchText) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, defaultSearch: searchText }
    }))
  }

  setProjectFiltersRef (node) {
    this.projectFiltersRef = node
  }

  sizePerPageListHandler = (sizePerPage) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, sizePerPage }
    }))
    keptState.options.sizePerPage = sizePerPage
  }

  toggle () {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    })
    const pfr = this.projectFiltersRef
    if (!pfr) { return }
    const colors = Object.values(pfr.state)
    if (colors.includes('danger')) {
      this.setState({ filtersVariant: 'outline-danger' })
    } else {
      this.setState({ filtersVariant: 'outline-primary' })
    }
  }

  render () {
    const {
      count, totalCount, results, loadingMore, loadMore, networkStatus,
      projectTypeFilters, projectStatusFilters, projectUpdatedFilters, projectPlatformFilters
    } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title='V8 Alba: Projects' />
          <Card>
            <Card.Header>
              <i className='icon-people' />Projects
            </Card.Header>
            <Card.Body>
              <Components.Loading />
            </Card.Body>
          </Card>
        </div>
      )
    }
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

    const hasMore = results && (totalCount > results.length)
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Projects' />
        <Card>
          <Card.Header>
            <i className='fa fa-camera' />Projects
            <Button size='sm' variant={this.state.filtersVariant} className='ml-2' onClick={this.handleShow}>Filters</Button>
            <Modal show={this.state.show} onHide={this.handleHide}>
              <ModalHeader closeButton>Project Filters</ModalHeader>
              <ModalBody>
                <Components.ProjectFilters vertical ref={this.setProjectFiltersRef} />
              </ModalBody>
            </Modal>
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
                }]),
                sizePerPage: this.state.options.sizePerPage
                  ? this.state.options.sizePerPage
                  : totalCount
              }}
              pagination
              search
              striped
              tableHeaderClass='d-none'
              version='4'
            >
              <TableHeaderColumn
                dataField='projectTitle'
                dataFormat={(cell, row) => (
                  <Link to={`/projects/${row._id}/${row.slug}`}>
                    {cell}
                  </Link>
                )}
              >
                Name
              </TableHeaderColumn>
              <TableHeaderColumn dataField='network' hidden>Network</TableHeaderColumn>
              <TableHeaderColumn dataField='projectType' hidden>Type</TableHeaderColumn>
              <TableHeaderColumn dataField='casting' hidden>Casting</TableHeaderColumn>
              <TableHeaderColumn dataField='status' hidden>Status</TableHeaderColumn>
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
  limit: 1000,
  terms: { view: 'projectsByTitle' }
}

registerComponent({
  name: 'ProjectsNameOnly',
  component: ProjectsNameOnly,
  hocs: [
    [withAccess, accessOptions],
    withFilters,
    [withMulti, multiOptions]
  ]
})
