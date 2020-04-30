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
import styled from 'styled-components'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import { dateFormatter, renderShowsTotal } from '../../modules/helpers.js'
import Offices from '../../modules/offices/collection.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  sortField: 'updatedAt',
  sortOrder: 'desc',
  page: 1,
  sizePerPage: 20,
  keptSearchText: ''
}

const CaretUnsorted = styled.span`
  margin: 10px 0px 10px 5px;
  color: rgb(204, 204, 204);
`
const CaretSorted = styled.span`
  margin: 10px 5px;
`

function AddButtonFooter () {
  return (
    <CardFooter>
      <Components.ModalTrigger title='New Office' component={<Button>Add an Office</Button>}>
        <Components.OfficesNewForm />
      </Components.ModalTrigger>
    </CardFooter>
  )
}

class OfficesDataTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      results: [],
      totalCount: 0,
      // Retrieve the last state
      sortField: keptState.sortField,
      sortOrder: keptState.sortOrder,
      page: keptState.page,
      sizePerPage: keptState.sizePerPage,
      keptSearchText: keptState.keptSearchText
    }
  }

  componentDidMount () {
    const { results, totalCount } = this.props
    if (results) {
      this.setState({ results, totalCount })
    }
  }

  componentDidUpdate (prevProps) {
    const { results, totalCount } = this.props
    if (results && !prevProps.results) {
      this.setState({ results, totalCount })
    }
  }

  componentWillUnmount () {
    // Remember state for the next mount
    keptState = {
      sortField: this.state.sortField,
      sortOrder: this.state.sortOrder,
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
      keptSearchText: this.state.keptSearchText
    }
  }

  pageChangeHandler = (page, sizePerPage) => {
    this.setState({ page, sizePerPage })
  }

  sizePerPageChangeHandler = (sizePerPage, page) => {
    this.setState({ sizePerPage, page })
  }

  sortChangeHandler = (sortField, sortOrder) => {
    this.setState({ sortField, sortOrder })
  }

  sortCaretFn = (order, column) => {
    if (!order) return (<CaretUnsorted className='fa fa-sort' />)
    else if (order === 'asc') return (<CaretSorted className='fa fa-sort-asc' />)
    else if (order === 'desc') return (<CaretSorted className='fa fa-sort-desc' />)
    return null
  }

  render () {
    const { count, loadingMore, loadMore, currentUser } = this.props

    const hasMore = this.state.results && (this.state.totalCount > this.state.results.length)

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
      onSort: this.sortChangeHandler,
      formatter: linkFormatter,
      headerStyle: {
        width: '30%'
      }
    }, {
      dataField: 'fullAddress',
      text: 'Address',
      sort: true,
      onSort: this.sortChangeHandler
    }, {
      dataField: 'updatedAt',
      text: 'Updated',
      sort: true,
      onSort: this.sortChangeHandler,
      formatter: dateFormatter,
      align: 'right',
      headerStyle: {
        textAlign: 'right',
        width: '6.6em'
      }
    }, {
      dataField: 'body',
      hidden: true
    }, {
      dataField: 'allContactNames',
      hidden: true
    }]

    const pagination = paginationFactory({
      custom: true,
      totalSize: this.state.totalCount,
      sizePerPageList: SIZE_PER_PAGE_LIST_SEED.concat([{
        text: 'All', value: this.state.totalCount
      }]),
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
      hidePageListOnlyOnePage: true,
      prePageText: '‹',
      nextPageText: '›',
      firstPageText: '«',
      lastPageText: '»',
      paginationTotalRenderer: renderShowsTotal,
      onPageChange: this.pageChangeHandler,
      onSizePerPageChange: this.sizePerPageChangeHandler
    })

    const contentTable = ({ paginationProps, paginationTableProps }) => (
      <>
      <ToolkitProvider
        keyField='_id'
        data={this.state.results}
        columns={columns}
        bootstrap4
        search={ { searchFormatted: true } }
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
                    <MyClearButton { ...toolkitProps.searchProps } />
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
                sort={{
                  sortCaret: this.sortCaretFn,
                  dataField: this.state.sortField,
                  order: this.state.sortOrder,
                }}
                noDataIndication={ () => <Components.Loading /> }
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
            <PaginationProvider pagination={pagination}>
            { contentTable }
            </PaginationProvider>
          </CardBody>
          {hasMore &&
            <CardFooter>
              {loadingMore
                ? <Components.Loading />
                : <Button onClick={e => { e.preventDefault(); loadMore() }}>Load More ({count}/{this.state.totalCount})</Button>
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
