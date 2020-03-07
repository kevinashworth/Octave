import { Components, registerComponent, withAccess, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { Component, PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Row } from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator'
import MyClearButton from '../common/react-bootstrap-table2/MyClearButton'
import MySearchBar from '../common/react-bootstrap-table2/MySearchBar'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import { dateFormatter, renderShowsTotal } from '../../modules/helpers.js'
import Offices from '../../modules/offices/collection.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  searchColor: 'btn-secondary',
  keptSearchText: '',
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
        <Components.ModalTrigger title='New Office' component={<Button>Add an Office</Button>}>
          <Components.OfficesNewForm />
        </Components.ModalTrigger>
      </CardFooter>
    )
  }
}

class OfficesDataTable extends Component {
  constructor (props) {
    super(props)
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
        onPageChange: this.pageChangeHandler,
        onSizePerPageList: this.sizePerPageListHandler,
        onSortChange: this.sortChangeHandler,
        onSearchChange: this.searchChangeHandler,
        clearSearch: true,
        clearSearchBtn: this.createCustomClearButton,
        searchField: this.createCustomSearchField,
        // Retrieve the last state
        ...keptState.options
      },
      searchColor: keptState.searchColor,
      keptSearchText: keptState.keptSearchText
    }
  }

  componentWillUnmount () {
    // Remember state for the next mount
    const { options } = this.state
    keptState = {
      searchColor: this.state.searchColor,
      keptSearchText: this.state.keptSearchText,
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

  sizePerPageListHandler = (sizePerPage) => {
    this.setState((prevState) => ({
      options: { ...prevState.options, sizePerPage }
    }))
  }

  render () {
    const { count, totalCount, results, loadingMore, loadMore, networkStatus, currentUser } = this.props

    if (networkStatus !== 8 && networkStatus !== 7) {
      return (
        <div className='animated fadeIn'>
          <Card className='card-accent-primary'>
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

    const linkFormatter = (cell, row) => {
      return (
        <Link to={`/offices/${row._id}/${row.slug}`}>
          {cell}
        </Link>
      )
    }

    const columns = [{
      dataField: 'displayName',
      text: 'Name',
      sort: true,
      formatter: linkFormatter,
      headerStyle: (column, colIndex) => {
        return { width: '30%' };
      }
    }, {
      dataField: 'fullAddress',
      text: 'Address',
      sort: true
    }, {
      dataField: 'updatedAt',
      text: 'Updated',
      sort: true,
      formatter: dateFormatter,
      align: 'right',
      headerStyle: (column, colIndex) => {
        return { width: '94px' };
      }
    }, {
      dataField: 'body',
      hidden: true
    }, {
      dataField: 'allContactNames',
      hidden: true
    }]

    const paginationFactoryOptions = {
      custom: true,
      page: this.state.options.page,
      prePageText: '‹',
      nextPageText: '›',
      firstPageText: '«',
      lastPageText: '»',
      sizePerPageList: SIZE_PER_PAGE_LIST_SEED.concat([{
        text: 'All', value: totalCount
      }]),
      paginationTotalRenderer: renderShowsTotal,
      showTotal: true
    }

    const btnColor = (txt) => {
      if (!txt) {
        return 'btn-secondary'
      }
      return 'btn-danger'
    }

    const contentTable = ({ paginationProps, paginationTableProps }) => (
      <>
      <ToolkitProvider
        keyField='_id'
        data={results}
        columns={columns}
        bootstrap4
        search
      >{
        (toolkitProps) => {
          const handleSearchBarChange = (e) => toolkitProps.searchProps.onSearch(e.target.value)
          return (
            <>
              <Row>
                <Col xs='4' lg='6'></Col>
                <Col xs='8' lg='6'>
                  <FormGroup className='input-group input-group-sm'>
                    <MySearchBar
                      handleChange={handleSearchBarChange}
                      searchText={toolkitProps.searchProps.searchText} />
                    <MyClearButton
                      className={btnColor(toolkitProps.searchProps.searchText)}
                      onClear={toolkitProps.searchProps.onClear} />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs='12'>
                  <PaginationTotalStandalone { ...paginationProps } />
                  <SizePerPageDropdownStandalone { ...paginationProps } />
                  <PaginationListStandalone { ...paginationProps } />
                </Col>
              </Row>
              <BootstrapTable striped condensed hover bordered={false}
                { ...toolkitProps.baseProps } { ...paginationTableProps } />
            </>
          )}}
        </ToolkitProvider>
        <PaginationTotalStandalone { ...paginationProps } />
        <SizePerPageDropdownStandalone { ...paginationProps } />
        <PaginationListStandalone { ...paginationProps } />
      </>
    )

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Offices' />
        <Card className='card-accent-primary'>
          <CardHeader>
            <i className='icon-briefcase' />Offices
          </CardHeader>
          <CardBody>
            <PaginationProvider pagination={paginationFactory(paginationFactoryOptions)}>
            { contentTable }
            </PaginationProvider>
          </CardBody>
          {hasMore &&
            <CardFooter>
              {loadingMore
                ? <Components.Loading />
                : <Button onClick={e => { e.preventDefault(); loadMore() }}>Load More ({count}/{totalCount})</Button>
              }
            </CardFooter>
          }
          {Users.canCreate({ collection: Offices, user: currentUser }) && <AddButtonFooter />}
        </Card>
      </div>
    )
  }
}

const accessOptions = {
  groups: ['members', 'admins'],
  redirect: '/login'
}

const multiOptions = {
  collection: Offices,
  fragmentName: 'OfficesDataTableFragment',
  limit: 1000
}

registerComponent({
  name: 'OfficesDataTable',
  component: OfficesDataTable,
  hocs: [
    [withAccess, accessOptions],
    withCurrentUser,
    [withMulti, multiOptions]
  ]}
)
