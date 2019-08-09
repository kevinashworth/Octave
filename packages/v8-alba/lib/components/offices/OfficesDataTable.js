import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { BootstrapTable, ClearSearchButton, SearchField, TableHeaderColumn } from 'react-bootstrap-table'
import moment from 'moment'
import { DATE_FORMAT_SHORT } from '../../modules/constants.js'
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
        <ClearSearchButton
          btnContextual={this.state.searchColor}
          onClick={e => handleClearButtonClick(onClick)} />
      )
    }

    this.state = {
      options: {
        sortIndicator: true,
        paginationSize: 5,
        hidePageListOnlyOnePage: true,
        prePage: 'Prev',
        nextPage: 'Next',
        firstPage: 'First',
        lastPage: 'Last',
        sizePerPageList: [ {
          text: '20', value: 20
        }, {
          text: '50', value: 50
        }, {
          text: '100', value: 100
        }, {
          text: 'All', value: this.props.totalCount
        } ],
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

  render () {
    const { count, totalCount, results, loadingMore, loadMore } = this.props
    const hasMore = results && (totalCount > results.length)
    const displayNameFormatter = (cell, row) => {
      return (
        <Link to={`/offices/${row._id}/${row.slug}`}>
          {cell}
        </Link>
      )
    }
    const loadingIndicator = () => {
      if (this.props.loading) {
        return <Components.Loading />
      } else {
        return 'There is no data to display'
      }
    }
    const dateFormatter = (cell, row) => {
      return moment(cell).format(DATE_FORMAT_SHORT)
    }
    function renderShowsTotal (from, to, size) {
      return (
        <span>
          Showing contacts { from } to { to } out of { size } &nbsp;&nbsp;
        </span>
      )
    }
    const columns = [{
      dataField: 'displayName',
      text: 'Office',
      formatter: displayNameFormatter,
    }, {
      dataField: 'fullAddress',
      text: 'Address',
      style: { whiteSpace: 'nowrap' },
    }, {
      dataField: 'updatedAt',
      text: 'Updated',
      formatter: dateFormatter,
      align: 'right',
      headerAlign: 'right',
    }]
    const options = {
      paginationSize: 5,
      hidePageListOnlyOnePage: true,
      prePageText: 'Prev',
      nextPageText: 'Next',
      firstPageText: 'First',
      lastPageText: 'Last',
      sizePerPageList: [ {
        text: '20', value: 20
      }, {
        text: '50', value: 50
      }, {
        text: '100', value: 100
      }, {
        text: 'All', value: totalCount
      } ],
      paginationTotalRenderer: renderShowsTotal,
    }


    return (
      <div className='animated fadeIn'>
        <Card>
          <CardHeader>
            <i className='icon-people' />Offices
          </CardHeader>
          <CardBody>
            <BootstrapTable data={results} version='4' condensed striped hover pagination search
              options={this.state.options} keyField='_id' bordered={false}>
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
            </BootstrapTable>
          </CardBody>
          <CardFooter>
            {loadingMore
              ? <Components.Loading />
              : <Button onClick={e => { e.preventDefault(); loadMore() }}>Load More ({count}/{totalCount})</Button>
            }
          </CardFooter>
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

registerComponent('OfficesDataTable', OfficesDataTable, [withMulti, options])
