import { Components, registerComponent, withAccess, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
// import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { BootstrapTable, ClearSearchButton, SearchField, SizePerPageDropDown, TableHeaderColumn } from 'react-bootstrap-table'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import Offices from '../../modules/offices/collection.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  options: {
    defaultSearch: '',
    page: 1,
    sizePerPage: null,
    sortOrder: 'desc'
  }
}

class OfficesNameOnly extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      searchColor: 'btn-secondary',
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
  }

  componentWillUnmount () {
    const { options } = this.state
    keptState = {
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

  render () {
    const { count, totalCount, results, loadingMore, loadMore, networkStatus } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title='V8 Alba: Offices' />
          <Card>
            <Card.Header>
              <i className='icon-briefcase' />Offices
            </Card.Header>
            <Card.Body>
              <Components.Loading />
            </Card.Body>
          </Card>
        </div>
      )
    }
    const hasMore = results && (totalCount > results.length)
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Offices' />
        <Card>
          <Card.Header>
            <i className='icon-briefcase' />Offices
          </Card.Header>
          <Card.Body>
            <BootstrapTable
              bordered={false}
              condensed
              data={results}
              hover
              keyField='_id'
              options={{
                ...this.state.options,
                sizePerPageList: SIZE_PER_PAGE_LIST_SEED.concat([{
                  text: 'All', value: totalCount
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
                  <Link to={`/offices/${row._id}/${row.slug}`}>
                    {cell}
                  </Link>
                )}
                dataSort
              >
                Name
              </TableHeaderColumn>
              <TableHeaderColumn dataField='fullAddress' hidden>Address</TableHeaderColumn>
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
  collection: Offices,
  fragmentName: 'OfficesDataTableFragment',
  limit: 1000
}

registerComponent({
  name: 'OfficesNameOnly',
  component: OfficesNameOnly,
  hocs: [
    [withAccess, accessOptions],
    [withMulti, multiOptions]
  ]
})
