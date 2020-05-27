/* eslint-disable react/jsx-curly-newline */
import { Components, registerComponent, withAccess, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { useEffect, useState } from 'react'
// import {
//   Button,
//   Card, CardBody, CardFooter, CardHeader,
//   Col, Row,
//   Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
//   FormGroup, Input,
//   Pagination, PaginationItem, PaginationLink
// } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import Pagination from 'react-bootstrap/Pagination'
import Row from 'react-bootstrap/Row'
import {
  useFilters,
  useGlobalFilter,
  useTable,
  usePagination,
  useSortBy
} from 'react-table'
import MyClearButton from '../common/react-table/MyClearButton'
import MySearchBar from '../common/react-table/MySearchBar'
import { PAGINATION_SIZE } from '../common/react-table/constants.js'
import { dateFormatter, linkFormatter, getPageOptionsVisible } from '../common/react-table/helpers.js'
import { CaretSorted, CaretUnsorted } from '../common/react-table/styled.js'
import matchSorter from 'match-sorter'
import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import Offices from '../../modules/offices/collection.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  filters: [{
    id: 'displayName',
    value: ''
  }, {
    id: 'fullAddress',
    value: ''
  }],
  globalFilter: '',
  pageIndex: 0,
  pageSize: 20,
  sortBy: [{
    desc: true,
    id: 'updatedAt'
  }]
}

function AddButtonFooter () {
  return (
    <Card.Footer>
      <Components.ModalTrigger title='New Office' label='Add an Office'>
        <Components.OfficesNewForm />
      </Components.ModalTrigger>
    </Card.Footer>
  )
}

function fuzzyTextFilterFn (rows, id, filterValue) {
  return matchSorter(rows, filterValue, {
    keys: [row => row.values[id]],
    threshold: matchSorter.rankings.ACRONYM
  })
}

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <FormGroup className='input-group input-group-sm'>
      <MySearchBar
        onChange={e => {
          const searchText = e.target.value || undefined
          setGlobalFilter(searchText)
        }}
        value={globalFilter || ''}
      />
      <MyClearButton globalFilter={globalFilter} onClick={() => setGlobalFilter('')} />
    </FormGroup>
  )
}

function DefaultColumnFilter ({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length
  const value = filterValue || ''
  const invalid = value.length > 0
  return (
    <FormControl
      className='column-filter'
      isInvalid={invalid}
      onChange={e => setFilter(e.target.value)}
      onClick={e => e.stopPropagation()} // Otherwise triggers sortBy
      placeholder={`Filter ${count} records...`}
      size='sm'
      value={value}
    />
  )
}

function MyPagination (tableProps) {
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
  const length = tableProps.rows.length

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen(prevState => !prevState)

  const pageOptionsVisible = getPageOptionsVisible({ pageCount, pageIndex, pageOptions })

  return (
    <div className='d-flex align-items-center'>
      <div className='mb-3'>
        Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, length)} out of {length} &nbsp;&nbsp;
      </div>
      <div className='mb-3'>
        <Dropdown show={dropdownOpen} onToggle={toggle}>
          <Dropdown.Toggle>
            {pageSize}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header disabled>Page Size</Dropdown.Header>
            {SIZE_PER_PAGE_LIST_SEED.map(pageSize => (
              <Dropdown.Item key={pageSize.text} onClick={e => setPageSize(pageSize.value)}>
                {pageSize.text}
              </Dropdown.Item>
            ))}
            <Dropdown.Item key='All' onClick={e => setPageSize(length)}>All</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className='ml-auto'>
        <Pagination aria-label='Page-by-page navigation of the Offices table'>
          {(pageOptionsVisible.length >= PAGINATION_SIZE) &&
            <Pagination.First disabled={pageIndex === 0} onClick={() => gotoPage(0)} />
          }
          <Pagination.Prev disabled={!canPreviousPage} onClick={() => previousPage()} />
          {pageOptionsVisible.map(page => (
            <Pagination.Item key={page} className={page === pageIndex ? 'active' : ''} onClick={() => gotoPage(page)}>
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={!canNextPage} onClick={() => nextPage()} />
          {(pageOptionsVisible.length >= PAGINATION_SIZE) &&
            <Pagination.Last disabled={pageIndex === (pageCount - 1)} onClick={() => gotoPage(pageCount - 1)} />
          }
        </Pagination>
      </div>
    </div>
  )
}

function Table ({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a fuzzyTextFilterFn filter type
      fuzzyText: fuzzyTextFilterFn,
      // Or override the default text filter to use "startsWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      }
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter
    }),
    []
  )

  const tableProps = useTable(
    {
      columns,
      data,
      defaultColumn,
      disableMultiSort: true,
      disableSortRemove: true,
      filterTypes,
      initialState: {
        filters: keptState.filters,
        globalFilter: keptState.globalFilter,
        hiddenColumns: ['allContactNames', 'body'],
        pageIndex: keptState.pageIndex,
        pageSize: keptState.pageSize,
        sortBy: keptState.sortBy
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // has only the rows for the active page
    prepareRow,
    setGlobalFilter,
    state: { filters, globalFilter, pageIndex, pageSize, sortBy }
  } = tableProps

  // Remember state for the next mount
  useEffect(() => {
    return () => {
      keptState = {
        filters,
        globalFilter,
        pageIndex,
        pageSize,
        sortBy
      }
    }
  })

  return (
    <>
      <Row>
        <Col xs='6' lg='8' />
        <Col xs='6' lg='4'>
          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Col>
      </Row>
      <MyPagination length={data.length} {...tableProps} />
      <table {...getTableProps()} className='react-table table table-striped table-hover table-sm'>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                // Return an array of prop objects and react-table will merge them appropriately
                <th
                  {...column.getHeaderProps([
                    { style: column.style },
                    column.getSortByToggleProps()
                  ])}
                  key={index}
                >
                  <span>
                    {column.render('Header')}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <CaretSorted className='fa fa-sort-desc' />
                        : <CaretSorted className='fa fa-sort-asc' />
                      : <CaretUnsorted className='fa fa-sort' />}
                  </span>
                  &nbsp;
                  <span>{column.canFilter ? column.render('Filter') : null}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(
            (row, index) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    return (
                      <td {...cell.getCellProps()} key={index}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            }
          )}
        </tbody>
      </table>
      <MyPagination length={data.length} {...tableProps} />
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
        Cell: linkFormatter,
        filter: 'fuzzyText',
        style: {
          width: '30%'
        }
      },
      {
        Header: 'Address',
        accessor: 'fullAddress',
        filter: 'fuzzyText'
      },
      {
        Header: 'Updated',
        accessor: 'updatedAt',
        disableFilters: true,
        Cell: dateFormatter,
        style: {
          textAlign: 'right',
          width: '6.6em'
        }
      },
      {
        accessor: 'body'
      }, {
        accessor: 'allContactNames'
      }
    ],
    []
  )

  if (networkStatus !== 8 && networkStatus !== 7) {
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Offices' />
        <Card className='card-accent-primary'>
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

  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8 Alba: Offices' />
      <Card className='card-accent-primary'>
        <Card.Header>
          <i className='icon-briefcase' />Offices
        </Card.Header>
        <Card.Body>
          <Table columns={columns} data={results} />
        </Card.Body>
        {hasMore &&
          <Card.Footer>
            {loadingMore
              ? <Components.Loading />
              : <Button onClick={e => { e.preventDefault(); loadMore() }}>Load More ({count}/{totalCount})</Button>
            }
          </Card.Footer>
        }
        {Users.canCreate({ collection: Offices, user: currentUser }) && <AddButtonFooter />}
      </Card>
    </div>
  )
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
  name: 'OfficesDataTable',
  component: OfficesDataTable,
  hocs: [
    [withAccess, accessOptions],
    withCurrentUser,
    [withMulti, multiOptions]
  ]
})
