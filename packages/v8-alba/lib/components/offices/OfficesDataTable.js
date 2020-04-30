/* eslint-disable no-unused-vars */
import { Components, registerComponent, withAccess, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Card, CardBody, CardFooter, CardHeader,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Pagination, PaginationItem, PaginationLink
} from 'reactstrap'
import { PAGINATION_SIZE } from '../common/react-table/constants.js'
import { dateFormatter, linkFormatter, getVisibles } from '../common/react-table/helpers.js'
import { CaretSorted, CaretUnsorted } from '../common/react-table/styled.js'
import {
  useTable,
  usePagination,
  useSortBy
} from 'react-table'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import Offices from '../../modules/offices/collection.js'

function AddButtonFooter () {
  return (
    <CardFooter>
      <Components.ModalTrigger title='New Office' component={<Button>Add an Office</Button>}>
        <Components.OfficesNewForm />
      </Components.ModalTrigger>
    </CardFooter>
  )
}

function MyPagination(tableProps) {
  const {
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableProps
  const length = tableProps.length

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen(prevState => !prevState)

  const {
    firstOptionVisible,
    lastOptionVisible,
    pageOptionsVisible
  } = getVisibles({pageCount, pageIndex, pageOptions})

  return (
    <div className='row align-items-center'>
      <div className='mb-3'>
        Showing {pageIndex*pageSize+1} to {Math.min((pageIndex+1)*pageSize,length)} out of {length} &nbsp;&nbsp;
      </div>
      <div className='mb-3'>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>
            {pageSize}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header disabled>Page Size</DropdownItem>
            {SIZE_PER_PAGE_LIST_SEED.map(pageSize => (
              <DropdownItem key={pageSize.text} onClick={e => setPageSize(pageSize.value)}>
                {pageSize.text}
              </DropdownItem>
            ))}
            <DropdownItem key='All' onClick={e => setPageSize(length)}>All</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className='ml-auto'>
        {pageOptionsVisible.length > 0 && pageSize !== length &&
        <Pagination aria-label='Paginagation navigation'>
          {firstOptionVisible > 0 &&
          <PaginationItem>
            <PaginationLink first onClick={() => gotoPage(0)} />
          </PaginationItem>
          }
          {canPreviousPage &&
          <PaginationItem>
            <PaginationLink previous onClick={() => previousPage()} />
          </PaginationItem>
          }
          {pageOptionsVisible.map(page => (
            <PaginationItem key={page} className={page === pageIndex ? 'active' : ''}>
              <PaginationLink onClick={() => gotoPage(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {canNextPage &&
          <PaginationItem>
            <PaginationLink next onClick={() => nextPage()} />
          </PaginationItem>
          }
          {lastOptionVisible < pageCount &&
          <PaginationItem>
            <PaginationLink last onClick={() => gotoPage(pageCount - 1)} />
          </PaginationItem>
          }
        </Pagination>
      }
      </div>
    </div>
  )
}

function Table({ columns, data }) {
  const tableProps = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 20
      }
    },
    useSortBy,
    usePagination
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // has only the rows for the active page
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableProps

  return (
    <>
    <MyPagination length={data.length} {...tableProps}/>
      <table {...getTableProps()} className='table table-striped table-hover table-sm'>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                // Add the sorting props into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={index}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <CaretSorted className='fa fa-sort-desc' />
                        : <CaretSorted className='fa fa-sort-asc' />
                      : <CaretUnsorted className='fa fa-sort' />}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(
            (row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    return (
                      <td {...cell.getCellProps()} key={index}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
      <MyPagination length={data.length} {...tableProps}/>
    </>
  )
}

function OfficesDataTable (props) {
  const [results, setResults] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const { count, currentUser, loadingMore, loadMore, networkStatus } = props
  const hasMore = results && (totalCount > results.length)

  useEffect(
    () => {
      if (props.results) {
        setResults(props.results)
        setTotalCount(props.totalCount)
      }
    },
    [props.results, props.totalCount]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'displayName',
        Cell: linkFormatter
      },
      {
        Header: 'Address',
        accessor: 'fullAddress'
      },
      {
        Header: 'Updated',
        accessor: 'updatedAt',
        Cell: dateFormatter
      }
    ],
    []
  )

  if (networkStatus !== 8 && networkStatus !== 7) {
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Offices' />
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

  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8 Alba: Offices' />
      <Card className='card-accent-primary'>
        <CardHeader>
          <i className='icon-briefcase' />Offices
        </CardHeader>
        <CardBody>
          <Table columns={columns} data={results} />
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
