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
import Contacts from '../../modules/contacts/collection.js'
import withFilters from '../../modules/hocs/withFilters.js'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import { dateFormatter, getAddress, renderShowsTotal } from '../../modules/helpers.js'

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

const AddButtonFooter = () => {
  return (
    <Card.Footer>
      <Components.ModalTrigger label='Add a Contact' title='New Contact'>
        <Components.ContactsNewForm />
      </Components.ModalTrigger>
    </Card.Footer>
  )
}

class ContactsDataTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      contact: null,
      options: {
        sortIndicator: true,
        paginationSize: 5,
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
  }

  componentWillUnmount () {
    // Remember state for the next mount
    const { options } = this.state
    keptState = {
      searchColor: this.state.searchColor,
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
        className='btn-sm'
        btnContextual={this.state.searchColor}
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
    this.setState({ show: false })
  }

  pageChangeHandler = (page, sizePerPage) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, page, sizePerPage }
    }))
  }

  rowClickHandler = (row, columnIndex, rowIndex, event) => {
    this.setState({
      contact: row,
      show: true
    })
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

  sortChangeHandler = (sortName, sortOrder) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, sortName, sortOrder }
    }))
  }

  render () {
    const {
      count, totalCount, results, loadingMore, loadMore, networkStatus, currentUser,
      contactTitleFilters, contactLocationFilters, contactUpdatedFilters
    } = this.props

    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Card className='card-accent-warning'>
            <Card.Header>
              <i className='icon-people' />Contacts
            </Card.Header>
            <Card.Body>
              <Components.Loading />
            </Card.Body>
          </Card>
        </div>
      )
    }

    const hasMore = results && (totalCount > results.length)
    const titleFilters = []
    contactTitleFilters.forEach(filter => {
      if (filter.value) { titleFilters.push(filter.contactTitle) }
    })
    const otherFilters = []
    contactTitleFilters.forEach(filter => {
      if (!filter.value) { otherFilters.push(filter.contactTitle) }
    })
    const locationFilters = []
    contactLocationFilters.forEach(filter => {
      if (filter.value) { locationFilters.push(filter.contactLocation) }
    })
    let momentNumber = ''
    let momentPeriod = ''
    contactUpdatedFilters.forEach(filter => {
      if (filter.value) {
        momentNumber = filter.momentNumber
        momentPeriod = filter.momentPeriod
      }
    })

    const filteredResults = _.filter(results, function (contact) {
      // compare current time generously, so start of day, i.e., filter plus up to 23:59
      const now = moment()
      const dateToCompare = contact.updatedAt ? contact.updatedAt : contact.createdAt
      const displayThis = moment(dateToCompare).isAfter(now.subtract(momentNumber, momentPeriod).startOf('day'))
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
        <Components.HeadTags title='V8: Contacts' />
        {this.state.contact &&
          <Modal show={this.state.show} onHide={this.handleHide}>
            <Modal.Header closeButton>
              <Modal.Title>
                <Link to={`/contacts/${this.state.contact._id}/${this.state.contact.slug}`}>{this.state.contact.displayName}</Link>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Components.ContactModal document={this.state.contact} />
            </Modal.Body>
          </Modal>}
        <Card className='card-accent-warning'>
          <Card.Header>
            <i className='icon-people' />Contacts
            <Components.ContactFilters />
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
                dataField='displayName'
                dataFormat={(cell, row) => (
                  <Link to={`/contacts/${row._id}/${row.slug}`}>
                    {cell}
                  </Link>
                )}
                dataSort
              >
                Name
              </TableHeaderColumn>
              <TableHeaderColumn dataField='title' dataSort>Title</TableHeaderColumn>
              <TableHeaderColumn dataField='addressString' dataSort>Address</TableHeaderColumn>
              <TableHeaderColumn
                dataField='updatedAt' dataSort dataFormat={dateFormatter}
                dataAlign='right' width='94px'
              >Updated
              </TableHeaderColumn>
              <TableHeaderColumn dataField='allLinks' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='allAddresses' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='body' hidden>Hidden</TableHeaderColumn>
            </BootstrapTable>
          </Card.Body>
          {hasMore &&
            <Card.Footer>
              {loadingMore
                ? <Components.Loading />
                : <Button onClick={e => { e.preventDefault(); loadMore() }}>Load More ({count}/{totalCount})</Button>}
            </Card.Footer>}
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
