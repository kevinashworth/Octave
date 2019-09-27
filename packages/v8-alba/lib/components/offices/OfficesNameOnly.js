import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
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

  render () {
    const { count, totalCount, results, loadingMore, loadMore, networkStatus } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title='V8 Alba: Offices' />
          <Card>
            <CardHeader>
              <i className='icon-briefcase' />Offices
            </CardHeader>
            <CardBody>
              <Components.Loading />
            </CardBody>
          </Card>
        </div>
      )
    }
    const hasMore = results && (totalCount > results.length)
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Offices' />
        <Card>
          <CardHeader>
            <i className='icon-briefcase' />Offices
          </CardHeader>
          <CardBody>
            <BootstrapTable data={results} version='4' condensed striped hover pagination search
              options={{
                ...this.state.options,
                sizePerPageList: SIZE_PER_PAGE_LIST_SEED.concat([{
                  text: 'All', value: totalCount
                }]),
                sizePerPage: this.state.options.sizePerPage ? this.state.options.sizePerPage : totalCount
              }}
              keyField='_id' bordered={false} tableHeaderClass='d-none'>
              <TableHeaderColumn dataField='displayName' dataSort dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/offices/${row._id}/${row.slug}`}>
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
  collection: Offices,
  fragmentName: 'OfficesDataTableFragment',
  limit: 1000
}

registerComponent({
  name: 'OfficesNameOnly',
  component: OfficesNameOnly,
  hocs: [[withMulti, options]]
})
