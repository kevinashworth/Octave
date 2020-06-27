/* eslint-disable react/jsx-curly-newline */
import { Components, registerComponent, withAccess, withCurrentUser, withMulti2 } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {
  useFilters,
  useGlobalFilter,
  useTable,
  usePagination,
  useSortBy
} from 'react-table'
import matchSorter from 'match-sorter'
import MyCode from '../common/MyCode'
import DefaultColumnFilter from '../common/react-table/DefaultColumnFilter'
import GlobalFilter from '../common/react-table/GlobalFilter'
import Pagination from '../common/react-table/Pagination'
import { dateFormatter, linkFormatter } from '../common/react-table/helpers.js'
import { CaretSorted, CaretUnsorted } from '../common/react-table/styled.js'
import Projects from '../../modules/projects/collection.js'
import { INITIAL_SIZE_PER_PAGE } from '../../modules/constants.js'

const SIZE_PER_LOAD = 250

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
// I have moved keptState.globalFilterValue to GlobalFilter.jsx
let keptState = {
  filters: [{
    id: 'projectTitle',
    value: ''
  }],
  globalFilter: undefined,
  pageIndex: 0,
  pageSize: INITIAL_SIZE_PER_PAGE,
  sortBy: [{
    desc: true,
    id: 'updatedAt'
  }]
}

let keptState2 = {
  limit: SIZE_PER_LOAD
}

function AddButtonFooter () {
  return (
    <Card.Footer>
      <Components.ModalTrigger label='Add a Project' title='New Project'>
        <Components.ProjectsNewForm />
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

  const tableProps = useTable(
    {
      columns,
      data,
      disableMultiSort: true,
      disableSortRemove: true,
      filterTypes,
      initialState: {
        filters: keptState.filters,
        globalFilter: keptState.globalFilter,
        hiddenColumns: ['allAddresses', 'allContactNames', 'notes', 'summary'],
        pageIndex: keptState.pageIndex,
        pageSize: keptState.pageSize,
        sortBy: keptState.sortBy
      }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination // The usePagination plugin hook must be placed after the useSortBy plugin hook
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
  tableProps.collection = 'projects'

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
      <Pagination length={data.length} {...tableProps} />
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
                  <div className='d-xl-flex flex-xl-row align-items-center'>
                    <div className='mr-2 text-nowrap'>
                      {column.render('Header')}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <CaretSorted className='fa fa-sort-desc' />
                          : <CaretSorted className='fa fa-sort-asc' />
                        : <CaretUnsorted className='fa fa-sort' />}
                    </div>
                    {column.canFilter &&
                      <div className='flex-xl-grow-1'>
                        {column.render('Filter')}
                      </div>}
                  </div>
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
      <Pagination length={data.length} {...tableProps} />
    </>
  )
}

function ProjectsDataTable (props) {
  const { count, currentUser, error, loading, loadingMore, loadMore, networkStatus, results, totalCount } = props
  const myLoadingMore = networkStatus === 2 || loadingMore
  const [limit, setLimit] = useState(keptState2.limit)

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'projectTitle',
        Cell: linkFormatter,
        filter: 'fuzzyText',
        Filter: DefaultColumnFilter,
        style: {
          width: '30%'
        }
      }, {
        Header: 'Casting',
        accessor: 'casting',
        Filter: null,
        disableFilters: true
      }, {
        Header: 'Network',
        accessor: 'network',
        Filter: null,
        disableFilters: true
      }, {
        Header: 'Type',
        accessor: 'projectType',
        Filter: null,
        disableFilters: true
      }, {
        Header: 'Status',
        accessor: 'status',
        Filter: null,
        disableFilters: true
      }, {
        Header: 'Updated',
        accessor: 'updatedAt',
        Filter: null,
        disableFilters: true,
        Cell: dateFormatter,
        style: {
          textAlign: 'right',
          width: '6.6em'
        }
      }, {
        accessor: 'allAddresses'
      }, {
        accessor: 'allContactNames'
      }, {
        accessor: 'notes'
      }, {
        accessor: 'summary'
      }
    ],
    []
  )

  useEffect(() => {
    if (limit > count && totalCount > count && !loading && !loadingMore && !myLoadingMore) {
      loadMore({
        limit
      })
    }
    // Remember state for the next mount
    return () => {
      keptState2 = {
        limit
      }
    }
  })

  const handleLoadMoreClick = (e) => {
    e.preventDefault()
    setLimit(limit + SIZE_PER_LOAD)
    loadMore({
      limit: limit + SIZE_PER_LOAD
    })
  }

  if (loading) {
    return (
      <Components.Loading />
    )
  }
  if (error) {
    return (
      <div>
        <MyCode code={error} language='json' />
      </div>
    )
  }

  return (
    <div>
      <Components.HeadTags title='V8: Projects' />
      <Card className='card-accent-danger'>
        <Card.Header>
          <i className='fa fa-camera' />Projects
        </Card.Header>
        <Card.Body>
          <Table columns={columns} data={results} />
        </Card.Body>
        {(totalCount > results.length) &&
          <Card.Footer>
            <Components.LoadingButton loading={myLoadingMore} onClick={handleLoadMoreClick} label={`Load ${SIZE_PER_LOAD} More (${count}/${totalCount})`} />
          </Card.Footer>
        }
        {Users.canCreate({ collection: Projects, user: currentUser }) && <AddButtonFooter />}
      </Card>
    </div>
  )
}

const accessOptions = {
  groups: ['participants', 'admins'],
  redirect: '/welcome/new'
}

const multiOptions = {
  collection: Projects,
  fragmentName: 'ProjectsDataTableFragment',
  limit: keptState2.limit,
  input: {
    sort: {
      updatedAt: 'desc'
    }
  }
}

registerComponent({
  name: 'ProjectsDataTable',
  component: ProjectsDataTable,
  hocs: [
    [withAccess, accessOptions],
    withCurrentUser,
    [withMulti2, multiOptions]
  ]
})
