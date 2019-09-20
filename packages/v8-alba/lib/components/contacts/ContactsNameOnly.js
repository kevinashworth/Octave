import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import { BootstrapTable, ClearSearchButton, SearchField, TableHeaderColumn } from 'react-bootstrap-table'
import _ from 'lodash'
import moment from 'moment'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import Contacts from '../../modules/contacts/collection.js'
import withFilters from '../../modules/hocs/withFilters.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  defaultSearch: '',
  page: 1,
  sizePerPage: 100,
  sortOrder: 'desc'
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
        <span>
          Showing contacts { start } to { to } out of { total } &nbsp;&nbsp;
        </span>
      )
    }

    const rowClickHandler = (row, columnIndex, rowIndex, event) => {
      this.setState({ contact: row })
      this.setState({ modal: true })
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
        <ClearSearchButton
          btnContextual={this.state.searchColor}
          onClick={e => handleClearButtonClick(onClick)} />
      )
    }

    this.state = {
      searchColor: 'btn-secondary',
      modal: false,
      contact: null,
      options: {
        sortIndicator: true,
        paginationSize: 5,
        hidePageListOnlyOnePage: true,
        prePage: 'Prev',
        nextPage: 'Next',
        firstPage: 'First',
        lastPage: 'Last',
        paginationShowsTotal: renderShowsTotal,
        paginationPosition: 'both',
        onPageChange: pageChangeHandler,
        onSizePerPageList: sizePerPageListHandler,
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
      sortOrder: options.sortOrder
    }
  }

  toggle () {
    this.setState({
      modal: !this.state.modal
    })
  }

  render () {
    const { count, totalCount, results, loadingMore, loadMore,
            contactTitleFilters, contactLocationFilters, contactUpdatedFilters } = this.props
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

      // return true

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

    return (
      <div className='animated fadeIn'>
        <Card>
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
                }])}}
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

registerComponent('ContactsNameOnly', ContactsNameOnly, withFilters, [withMulti, options])
