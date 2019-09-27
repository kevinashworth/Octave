import { Components, registerComponent, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import { BootstrapTable, ClearSearchButton, SearchField, TableHeaderColumn } from 'react-bootstrap-table'
import moment from 'moment'
import { DATE_FORMAT_SHORT, SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import Offices from '../../modules/offices/collection.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  defaultSearch: '',
  page: 1,
  sizePerPage: 20,
  sortName: 'updatedAt',
  sortOrder: 'desc'
}

function dateFormatter (cell, row) {
  return moment(cell).format(DATE_FORMAT_SHORT)
}

class OfficesDataTable extends PureComponent {
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
        clearSearch: true,
        clearSearchBtn: createCustomClearButton,
        searchField: createCustomSearchField,
        // Retrieve the last state
        ...keptState
      }
    }
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

  render () {
    const { count, totalCount, results, loadingMore, loadMore, currentUser } = this.props
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
                  text: 'All', value: this.props.totalCount
                }]) }}
              keyField='_id' bordered={false}>
              <TableHeaderColumn dataField='displayName' dataSort dataFormat={
                (cell, row) => {
                  return (
                    <Link to={`/offices/${row._id}/${row.slug}`}>
                      {cell}
                    </Link>
                  )
                }
              }>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='fullAddress' dataSort>Address</TableHeaderColumn>
              <TableHeaderColumn dataField='updatedAt' dataFormat={dateFormatter} dataSort width='9%'>Updated</TableHeaderColumn>
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
          {Offices.options.mutations.new.check(currentUser)
            ? <CardFooter>
              <Components.ModalTrigger title='New Office' component={<Button>Add an Office</Button>}>
                <Components.OfficesNewForm currentUser={currentUser} />
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
  collection: Offices,
  fragmentName: 'OfficesDataTableFragment',
  limit: 1000
}

registerComponent('OfficesDataTable', OfficesDataTable, withCurrentUser, [withMulti, options])
