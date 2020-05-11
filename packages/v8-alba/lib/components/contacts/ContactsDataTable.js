import { Components, registerComponent, withAccess, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { Component, PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { BootstrapTable, ClearSearchButton, SearchField, TableHeaderColumn } from 'react-bootstrap-table'
import _ from 'lodash'
import moment from 'moment'
import Contacts from '../../modules/contacts/collection.js'
import withFilters from '../../modules/hocs/withFilters.js'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import { dateFormatter, renderShowsTotal } from '../../modules/helpers.js'
import { getAddress } from '../../modules/helpers.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  searchColor: 'btn-secondary',
  options: {
    defaultSearch: '',
    page: 1,
    sizePerPage: 20,
    sortName: 'updatedAt',
    sortOrder: 'desc'
  }
}

class AddButtonFooter extends PureComponent {
  render () {
    return (
      <CardFooter>
        <Components.ModalTrigger title='New Contact' component={<Button>Add a Contact</Button>}>
          <Components.ContactsNewForm />
        </Components.ModalTrigger>
      </CardFooter>
    )
  }
}

class ContactsDataTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: false,
      contact: null,
      options: {
        sortIndicator: true,
        paginationSize: 5,
        hidePageListOnlyOnePage: true,
        prePage: '‹',
        nextPage: '›',
        firstPage: '«',
        lastPage: '»',
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
    this.sortChangeHandler = this.sortChangeHandler.bind(this)
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
    this.setState({ contact: row })
    this.setState({ modal: true })
  }

  render () {
    const { count, totalCount, results, loadingMore, loadMore, networkStatus, currentUser,
            contactTitleFilters, contactLocationFilters, contactUpdatedFilters } = this.props

    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Card className='card-accent-warning'>
            <CardHeader>
              <i className='icon-people' />Contacts
            </CardHeader>
            <CardBody>
              <Components.Loading />
            </CardBody>
          </Card>
        </div>
      )
    }

    const hasMore = results && (totalCount > results.length)
    let titleFilters = []
    contactTitleFilters.forEach(filter => {
      if (filter.value) { titleFilters.push(filter.contactTitle) }
    })
    let otherFilters = []
    contactTitleFilters.forEach(filter => {
      if (!filter.value) { otherFilters.push(filter.contactTitle) }
    })
    let locationFilters = []
    contactLocationFilters.forEach(filter => {
      if (filter.value) { locationFilters.push(filter.contactLocation) }
    })
    let moment1 = ''
    let moment2 = ''
    contactUpdatedFilters.forEach(filter => {
      if (filter.value) {
        moment1 = filter.moment1
        moment2 = filter.moment2
      }
    })

    const filteredResults = _.filter(results, function (contact) {
      // compare current time generously, so start of day, i.e., filter plus up to 23:59
      const now = moment()
      const dateToCompare = contact.updatedAt ? contact.updatedAt : contact.createdAt
      const displayThis = moment(dateToCompare).isAfter(now.subtract(moment1, moment2).startOf('day'))
      if (!displayThis) {
        return false
      }
      const location = contact.theAddress.location ? contact.theAddress.location : getAddress({ contact }).location
      // if "Other" is not checked, filter per normal via titleFilters:
      if (!(_.includes(titleFilters, 'Other'))) {
        return _.includes(locationFilters, location) &&
            _.includes(titleFilters, contact.title) &&
            displayThis
      } else if (_.every(titleFilters, { value: true })) {
        // if "Other" is checked and so are all the titles, do not filter by title
        return _.includes(locationFilters, location) &&
            displayThis
      } else {
        // if "Other" is checked and some are not checked, eliminate based on titles in contactTitleFilters
        return _.includes(locationFilters, location) &&
            !_.includes(otherFilters, contact.title) &&
            displayThis
      }
    })

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Contacts' />
        <Modal isOpen={this.state.modal} toggle={this.toggle} modalTransition={{ timeout: 100 }}>
          {this.state.contact &&
            <ModalHeader toggle={this.toggle}>
              <Link to={`/contacts/${this.state.contact._id}/${this.state.contact.slug}`}>{this.state.contact.displayName}</Link>
            </ModalHeader>}
          <ModalBody>
            <Components.ContactModal document={this.state.contact} />
          </ModalBody>
        </Modal>
        <Card className='card-accent-warning'>
          <CardHeader>
            <i className='icon-people' />Contacts
            <Components.ContactFilters />
          </CardHeader>
          <CardBody>
            <BootstrapTable data={filteredResults} version='4' condensed striped hover pagination search
              options={{
                ...this.state.options,
                sizePerPageList: SIZE_PER_PAGE_LIST_SEED.concat([{
                  text: 'All', value: this.props.totalCount
                }])
              }}
              keyField='_id' bordered={false}>
              <TableHeaderColumn dataField='displayName' dataSort dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/contacts/${row._id}/${row.slug}`}>
                      {cell}
                    </Link>
                  )
                }
              }>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='title' dataSort>Title</TableHeaderColumn>
              <TableHeaderColumn dataField='addressString' dataSort>Address</TableHeaderColumn>
              <TableHeaderColumn dataField='updatedAt' dataSort dataFormat={dateFormatter}
                  dataAlign='right' width='94px'>Updated</TableHeaderColumn>
              <TableHeaderColumn dataField='allLinks' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='allAddresses' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='body' hidden>Hidden</TableHeaderColumn>
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
          {Users.canCreate({ collection: Contacts, user: currentUser }) && <AddButtonFooter />}
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
  collection: Contacts,
  fragmentName: 'ContactsDataTableFragment',
  limit: 1000
}

registerComponent({
  name: 'ContactsDataTable',
  component: ContactsDataTable,
  hocs: [
    [withAccess, accessOptions],
    withCurrentUser,
    withFilters,
    [withMulti, multiOptions]
  ]
})
