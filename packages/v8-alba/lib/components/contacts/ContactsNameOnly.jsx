import { Components, registerComponent, withAccess, withMulti } from 'meteor/vulcan:core'
import React, { Component } from 'react'
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
import Contacts from '../../modules/contacts/collection.js'
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

class ContactsNameOnly extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filtersVariant: keptState.filtersVariant,
      searchColor: keptState.searchColor,
      show: false,
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
        btnGroup: () => { return null }, // hides area above search field
        ...keptState.options
      }
    }
    this.toggle = this.toggle.bind(this)
    this.setContactFiltersRef = this.setContactFiltersRef.bind(this)
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

  sizePerPageListHandler = (sizePerPage) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, sizePerPage }
    }))
    keptState.options.sizePerPage = sizePerPage
  }

  setContactFiltersRef (node) {
    this.contactFiltersRef = node
  }

  toggle () {
    this.setState({
      show: !this.state.show
    })
    const cfr = this.contactFiltersRef
    if (!cfr) { return } // is null when modal opens, has value when closes
    const colors = Object.values(cfr.state) // includes unwanted state values, but no big deal to include them
    if (colors.includes('danger')) {
      this.setState({ filtersVariant: 'outline-danger' })
    } else {
      this.setState({ filtersVariant: 'outline-primary' })
    }
  }

  render () {
    const { count, totalCount, results, loadingMore, loadMore, networkStatus, contactTitleFilters, contactLocationFilters, contactUpdatedFilters } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title='V8 Alba: Contacts' />
          <Card>
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
    var titleFilters = []
    contactTitleFilters.forEach(filter => {
      if (filter.value) { titleFilters.push(filter.contactTitle) }
    })
    var otherFilters = []
    contactTitleFilters.forEach(filter => {
      if (!filter.value) { otherFilters.push(filter.contactTitle) }
    })
    var locationFilters = []
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
    const filteredResults = _.filter(results, function (o) {
      // compare current time to filter, but generous, so start of day then, not the time it is now - filter plus up to 23:59
      const now = moment()
      const dateToCompare = o.updatedAt ? o.updatedAt : o.createdAt
      const displayThis = moment(dateToCompare).isAfter(now.subtract(moment1, moment2).startOf('day'))
      let theLocation = 'Unknown'
      if (o.theAddress) {
        if (o.theAddress.location) {
          theLocation = o.theAddress.location
        }
      } else if (o.addresses) {
        if (o.addresses[0]) {
          if (o.addresses[0].state) {
            theLocation = o.addresses[0].state
          }
        }
      }
      // if "Other" is not checked, filter per normal via titleFilters:
      if (!(_.includes(titleFilters, 'Other'))) {
        return _.includes(locationFilters, theLocation) &&
            _.includes(titleFilters, o.title) &&
            displayThis
      } else if (_.every(titleFilters, { value: true })) {
        // if "Other" is checked and so are all the titles, do not filter by title
        return _.includes(locationFilters, theLocation) &&
            displayThis
      } else {
        // if "Other" is checked and some are not checked, eliminate based on titles in contactTitleFilters
        return _.includes(locationFilters, theLocation) &&
            !_.includes(otherFilters, o.title) &&
            displayThis
      }
    })

    const hasMore = results && (totalCount > results.length)
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Contacts' />
        <Card>
          <Card.Header>
            <i className='icon-people' />Contacts
            <Button size='sm' variant={this.state.filtersVariant} className='ml-2' onClick={this.handleShow}>Filters</Button>
            <Modal show={this.state.show} onHide={this.handleHide}>
              <ModalHeader closeButton>Contact Filters</ModalHeader>
              <ModalBody>
                <Components.ContactFilters vertical ref={this.setContactFiltersRef} />
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
                dataField='displayName'
                dataFormat={(cell, row) => (
                  <Link to={`/contacts/${row._id}/${row.slug}`}>
                    {row.firstName} {row.middleName ? row.middleName : null} <strong>{row.lastName}</strong>
                  </Link>
                )}
              >
                Name
              </TableHeaderColumn>
              <TableHeaderColumn dataField='title' hidden>Title</TableHeaderColumn>
              <TableHeaderColumn dataField='addressString' hidden>Address</TableHeaderColumn>
              <TableHeaderColumn dataField='allLinks' hidden>Hidden</TableHeaderColumn>
              <TableHeaderColumn dataField='body' hidden>Hidden</TableHeaderColumn>
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
  collection: Contacts,
  fragmentName: 'ContactsDataTableFragment',
  limit: 1000,
  terms: { view: 'contactsByLastName' }
}

registerComponent({
  name: 'ContactsNameOnly',
  component: ContactsNameOnly,
  hocs: [
    [withAccess, accessOptions],
    withFilters,
    [withMulti, multiOptions]
  ]
})
