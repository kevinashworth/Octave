import { Components, registerComponent, withAccess, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { BootstrapTable, ClearSearchButton, SearchField, SizePerPageDropDown, TableHeaderColumn } from 'react-bootstrap-table'
import _ from 'lodash'
import moment from 'moment'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import Projects from '../../modules/projects/collection.js'
import withFilters from '../../modules/hocs/withFilters.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  filtersColor: 'primary',
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

    const pageChangeHandler = (page, sizePerPage) => {
      this.setState((prevState) => ({
        options: { ...prevState.options, page, sizePerPage }
      }))
    }

    function renderShowsTotal (start, to, total) {
      return (
        <span className='mr-2'>
          Showing { start } to { to } out of { total }
        </span>
      )
    }

    const searchChangeHandler = (searchText) => {
      this.setState((prevState) => ({
        options: { ...prevState.options, defaultSearch: searchText }
      }))
    }

    const sizePerPageListHandler = (sizePerPage) => {
      this.setState((prevState) => ({
        options: { ...prevState.options, sizePerPage }
      }))
      keptState.options.sizePerPage = sizePerPage
    }

    const renderSizePerPageDropDown = (props) => {
      return (
        <SizePerPageDropDown btnContextual='btn-secondary btn-sm' {...props} />
      )
    }

    const createCustomSearchField = (props) => {
      if (props.defaultValue.length) {
        this.setState({ searchColor: 'btn-danger' })
      } else {
        this.setState({ searchColor: 'btn-secondary' })
      }
      return (
        <SearchField defaultValue={props.defaultValue} />
      )
    }

    const handleClearButtonClick = (onClick) => {
      this.setState({ searchColor: 'btn-secondary' })
      onClick()
    }

    const createCustomClearButton = (onClick) => {
      return (
        <ClearSearchButton className='btn-sm'
          btnContextual={this.state.searchColor}
          onClick={e => handleClearButtonClick(onClick)} />
      )
    }

    this.state = {
      searchColor: 'btn-secondary',
      filtersColor: keptState.filtersColor,
      modalIsOpen: false,
      options: {
        sortIndicator: true,
        paginationSize: 4,
        hidePageListOnlyOnePage: true,
        prePage: '‹',
        nextPage: '›',
        firstPage: '«',
        lastPage: '»',
        paginationShowsTotal: renderShowsTotal,
        paginationPosition: 'bottom',
        onPageChange: pageChangeHandler,
        onSizePerPageList: sizePerPageListHandler,
        sizePerPageDropDown: renderSizePerPageDropDown,
        onSearchChange: searchChangeHandler,
        clearSearch: true,
        clearSearchBtn: createCustomClearButton,
        searchField: createCustomSearchField,
        btnGroup: () => { return null },
        ...keptState.options
      }
    }
    this.toggle = this.toggle.bind(this)
    this.setProjectFiltersRef = this.setProjectFiltersRef.bind(this)
  }

  setProjectFiltersRef (node) {
    this.projectFiltersRef = node
  }

  componentWillUnmount () {
    const { filtersColor, options } = this.state
    keptState = {
      filtersColor,
      options: {
        defaultSearch: options.defaultSearch,
        page: options.page,
        sizePerPage: options.sizePerPage ? options.sizePerPage : null,
        sortOrder: options.sortOrder
      }
    }
  }

  toggle () {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    })
    const pfr = this.projectFiltersRef
    if (!pfr) { return }
    const colors = Object.values(pfr.state)
    if (colors.includes('danger')) {
      this.setState({ filtersColor: 'danger' })
    } else {
      this.setState({ filtersColor: 'primary' })
    }
  }

  render () {
    const { count, totalCount, results, loadingMore, loadMore, networkStatus,
            projectTypeFilters, projectStatusFilters, projectUpdatedFilters, projectPlatformFilters } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title='V8 Alba: Projects' />
          <Card>
            <CardHeader>
              <i className='icon-people' />Projects
            </CardHeader>
            <CardBody>
              <Components.Loading />
            </CardBody>
          </Card>
        </div>
      )
    }
    let typeFilters = []
    projectTypeFilters.forEach(filter => {
      if (filter.value) { typeFilters.push(filter.projectType) }
    })
    let statusFilters = []
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
    let platformFilters = []
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
          <CardHeader>
            <i className='fa fa-camera' />Projects
              <Button outline size='sm' color={this.state.filtersColor} className='ml-2' onClick={this.toggle}>Filters</Button>
              <Modal isOpen={this.state.modalIsOpen} toggle={this.toggle} modalTransition={{ timeout: 100 }}>
                <ModalHeader toggle={this.toggle}>Project Filters</ModalHeader>
                <ModalBody>
                  <Components.ProjectFilters vertical ref={this.setProjectFiltersRef} />
                </ModalBody>
              </Modal>
          </CardHeader>
          <CardBody>
            <BootstrapTable data={filteredResults} version='4' condensed striped hover pagination search
              options={{
                ...this.state.options,
                sizePerPageList: SIZE_PER_PAGE_LIST_SEED.concat([{
                  text: 'All', value: this.props.totalCount
                }]),
                sizePerPage: this.state.options.sizePerPage ? this.state.options.sizePerPage : totalCount
              }}
              keyField='_id' bordered={false} tableHeaderClass='d-none'>
              <TableHeaderColumn dataField='projectTitle' dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/projects/${row._id}/${row.slug}`}>
                      {cell}
                    </Link>
                  )
                }
              }>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='network' hidden>Network</TableHeaderColumn>
              <TableHeaderColumn dataField='projectType' hidden>Type</TableHeaderColumn>
              <TableHeaderColumn dataField='casting' hidden>Casting</TableHeaderColumn>
              <TableHeaderColumn dataField='status' hidden>Status</TableHeaderColumn>
              <TableHeaderColumn dataField='summary' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='notes' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='allContactNames' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='allAddresses' hidden>Hidden</TableHeaderColumn>
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
