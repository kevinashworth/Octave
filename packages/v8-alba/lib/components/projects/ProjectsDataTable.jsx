import { Components, registerComponent, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { BootstrapTable, ClearSearchButton, SearchField, TableHeaderColumn } from 'react-bootstrap-table'
import _ from 'lodash'
import moment from 'moment'
import { DATE_FORMAT_SHORT, SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import Projects from '../../modules/projects/collection.js'
import withFilters from '../../modules/hocs/withFilters.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  defaultSearch: '',
  page: 1,
  sizePerPage: 50,
  sortName: 'projectTitle',
  sortOrder: 'asc'
}

function dateFormatter (cell, row) {
  return moment(cell).format(DATE_FORMAT_SHORT)
}

class ProjectsDataTable extends PureComponent {
  constructor (props) {
    super(props)

    const pageChangeHandler = (page, sizePerPage) => {
      this.setState((prevState) => ({
        options: { ...prevState.options, page, sizePerPage }
      }))
    }

    function renderShowsTotal (start, to, total) {
      return (
        <span>
          Showing { start } to { to } out of { total } &nbsp;&nbsp;
        </span>
      )
    }

    const rowClickHandler = (row, columnIndex, rowIndex, event) => {
      this.setState({ project: row })
      this.setState({ modal: true })
    }

    const sortChangeHandler = (sortName, sortOrder) => {
      this.setState((prevState) => ({
        options: { ...prevState.options, sortName, sortOrder }
      }))
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
        onPageChange: pageChangeHandler,
        onSizePerPageList: sizePerPageListHandler,
        onSortChange: sortChangeHandler,
        onSearchChange: searchChangeHandler,
        onRowClick: rowClickHandler,
        clearSearch: true,
        clearSearchBtn: createCustomClearButton,
        searchField: createCustomSearchField,
        // Retrieve the last state
        ...keptState
      }
    }
    this.toggle = this.toggle.bind(this)
  }

  componentWillUnmount () {
    // Remember state for the next mount
    const { options } = this.state
    keptState = {
      defaultSearch: options.defaultSearch,
      page: options.page,
      sizePerPage: options.sizePerPage,
      sortName: options.sortName,
      sortOrder: options.sortOrder
    }
  }

  toggle () {
    this.setState({
      modal: !this.state.modal
    })
  }

  titleSortFunc (a, b, order) {
    if (order === 'asc') {
      return a.sortTitle.localeCompare(b.sortTitle)
    } else {
      return b.sortTitle.localeCompare(a.sortTitle)
    }
  }

  render () {
    const { count, totalCount, results, loadingMore, loadMore, networkStatus, currentUser,
            projectTypeFilters, projectStatusFilters, projectUpdatedFilters, projectPlatformFilters } = this.props

    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Card className='card-accent-danger'>
            <CardHeader>
              <i className='fa fa-camera' />Projects
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

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Projects' />
        <Modal isOpen={this.state.modal} toggle={this.toggle} modalTransition={{ timeout: 100 }}>
          {this.state.project
            ? <ModalHeader toggle={this.toggle}>
              <Link to={`/projects/${this.state.project._id}/${this.state.project.slug}`}>{this.state.project.projectTitle}</Link>
            </ModalHeader>
            : null
          }
          <ModalBody>
            <Components.ProjectModal document={this.state.project} />
          </ModalBody>
        </Modal>
        <Card className='card-accent-danger'>
          <CardHeader>
            <i className='fa fa-camera' />Projects
            <Components.ProjectFilters />
          </CardHeader>
          <CardBody>
            <BootstrapTable condensed hover pagination search striped
              data={filteredResults}
              bordered={false} keyField='_id'
              options={{
                ...this.state.options,
                sizePerPageList: SIZE_PER_PAGE_LIST_SEED.concat([{
                  text: 'All', value: this.props.totalCount
                }])
              }}
              version='4'>
              <TableHeaderColumn dataField='projectTitle' dataSort sortFunc={ this.titleSortFunc } dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/projects/${row._id}/${row.slug}`}>
                      {cell}
                    </Link>
                  )
                }
              } width='25%'>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='casting' dataSort>Casting</TableHeaderColumn>
              <TableHeaderColumn dataField='network' dataSort>Network</TableHeaderColumn>
              <TableHeaderColumn dataField='projectType' dataSort>Type</TableHeaderColumn>
              <TableHeaderColumn dataField='status' dataSort width='94px'>Status</TableHeaderColumn>
                <TableHeaderColumn dataField='updatedAt' dataSort dataFormat={dateFormatter}
                  dataAlign='right' width='94px'>Updated</TableHeaderColumn>
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
          {Projects.options.mutations.new.check(currentUser)
            ? <CardFooter>
              <Components.ModalTrigger title='New Project' component={<Button>Add a Project</Button>}>
                <Components.ProjectsNewForm currentUser={currentUser} />
              </Components.ModalTrigger>
            </CardFooter>
            : null
          }
        </Card>
      </div>
    )
  }
}

const options = {
  collection: Projects,
  fragmentName: 'ProjectsDataTableFragment',
  limit: 1000
}

registerComponent({
  name: 'ProjectsDataTable',
  component: ProjectsDataTable,
  hocs: [withCurrentUser, withFilters, [withMulti, options]]
})
