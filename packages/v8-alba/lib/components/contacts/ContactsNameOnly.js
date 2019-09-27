import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { BootstrapTable, ClearSearchButton, SearchField, SizePerPageDropDown, TableHeaderColumn } from 'react-bootstrap-table'
import _ from 'lodash'
import moment from 'moment'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import Contacts from '../../modules/contacts/collection.js'
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

class ContactsNameOnly extends PureComponent {
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
        btnGroup: () => { return null }, // hides area above search field
        ...keptState.options
      }
    }
    this.toggle = this.toggle.bind(this)
    this.setContactFiltersRef = this.setContactFiltersRef.bind(this)
  }

  setContactFiltersRef = (node) => {
    this.contactFiltersRef = node
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
    const cfr = this.contactFiltersRef
    if (!cfr) { return } // is null when modal opens, has value when closes
    const colors = Object.values(cfr.state) // includes unwanted state values, but no big deal to include them
    if (colors.includes('danger')) {
      this.setState({ filtersColor: 'danger' })
    } else {
      this.setState({ filtersColor: 'primary' })
    }
  }

  render () {
    const { count, totalCount, results, loadingMore, loadMore, networkStatus,
            contactTitleFilters, contactLocationFilters, contactUpdatedFilters } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title='V8 Alba: Contacts' />
          <Card>
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
          <CardHeader>
            <i className='icon-people' />Contacts
            <Button outline size='sm' color={this.state.filtersColor} className='ml-2' onClick={this.toggle}>Filters</Button>
            <Modal isOpen={this.state.modalIsOpen} toggle={this.toggle} modalTransition={{ timeout: 100 }}>
              <ModalHeader toggle={this.toggle}>Contact Filters</ModalHeader>
              <ModalBody>
                <Components.ContactFilters vertical ref={this.setContactFiltersRef} />
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
              <TableHeaderColumn dataField='displayName' dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/contacts/${row._id}/${row.slug}`}>
                      {cell}
                    </Link>
                  )
                }
              }>Name</TableHeaderColumn>
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

const options = {
  collection: Contacts,
  fragmentName: 'ContactsDataTableFragment',
  limit: 1000,
  terms: { view: 'contactsByLastName' }
}

registerComponent({
  name: 'ContactsNameOnly',
  component: ContactsNameOnly,
  hocs: [withFilters, [withMulti, options]]
} )
