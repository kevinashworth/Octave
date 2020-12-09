import { Components, withAccess, useCurrentUser, useMulti2 } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import MyCode from '../common/MyCode'
import MyLoading from '../common/MyLoading'
import DefaultColumnFilter from '../common/react-table/DefaultColumnFilter'
import GlobalFilter from '../common/react-table/GlobalFilter'
import Pagination from '../common/react-table/Pagination'
import { dateFormatter, linkFormatter } from '../common/react-table/helpers.js'
import Caret from '../common/react-table/Caret'
import { useUnmount } from '../../hooks'
import Offices from '../../modules/offices/collection.js'
import { INITIAL_SIZE_PER_PAGE, LOADING_OFFICES_DATA } from '../../modules/constants.js'

const SIZE_PER_LOAD = 200
const AUTOMATICALLY_LOAD_UP_TO = 600
const hiddenColumns = ['allContactNames', 'body']

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
  globalFilter: undefined,
  pageIndex: 0,
  pageSize: INITIAL_SIZE_PER_PAGE,
  sortBy: [{
    desc: true,
    id: 'updatedAt'
  }]
}

let keptLimit = AUTOMATICALLY_LOAD_UP_TO

const AddButtonFooter = ({ successCallback }) => {
  return (
    <Card.Footer>
      <Components.ModalTrigger label='Add an Office' title='New Office'>
        <Components.OfficesNewForm successCallback={successCallback} />
      </Components.ModalTrigger>
    </Card.Footer>
  )
}

const Table = ({ columns, data, loading, totalCount }) => {
  const tableProps = useTable(
    {
      columns,
      data: loading ? LOADING_OFFICES_DATA : data,
      disableMultiSort: true,
      disableSortRemove: true,
      initialState: {
        filters: keptState.filters,
        globalFilter: keptState.globalFilter,
        hiddenColumns: hiddenColumns,
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
  tableProps.collection = 'offices'

  useEffect(() => {
    keptState = {
      globalFilter,
      pageIndex,
      pageSize,
      sortBy
    }
  }, [filters, globalFilter, pageIndex, pageSize, sortBy])

  useUnmount(() => {
    keptState = {
      filters,
      globalFilter,
      pageIndex,
      pageSize,
      sortBy
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
      <Pagination {...tableProps} totalCount={totalCount} />
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
                      <Caret column={column} />
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
                      <td {...cell.getCellProps()} key={index}>{loading ? <MyLoading variant={index === 0 && 'primary'} /> : cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            }
          )}
        </tbody>
      </table>
      <Pagination {...tableProps} />
    </>
  )
}

const OfficesDataTable = () => {
  const { count, error, loading, loadingMore, loadMore, refetch, results, totalCount } = useMulti2({
    collection: Offices,
    fragmentName: 'OfficesDataTableFragment',
    input: {
      enableCache: true,
      limit: keptLimit
    },
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })

  const { currentUser } = useCurrentUser()

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'displayName',
        Cell: linkFormatter,
        Filter: DefaultColumnFilter,
        style: {
          width: '30%'
        }
      }, {
        Header: 'Address',
        accessor: 'fullAddress',
        Filter: DefaultColumnFilter
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
      },
      ...hiddenColumns.map(id => ({
        accessor: id
      }))
    ],
    []
  )

  useEffect(() => {
    if (keptLimit > AUTOMATICALLY_LOAD_UP_TO && count < keptLimit && !loading && !loadingMore) {
      loadMore({
        limit: keptLimit
      })
    } else if (count < totalCount && count < AUTOMATICALLY_LOAD_UP_TO && !loading && !loadingMore) {
      const newLimit = count + SIZE_PER_LOAD
      loadMore({
        limit: newLimit
      })
    }
  })

  const handleLoadMoreClick = (e) => {
    e.preventDefault()
    const newLimit = Math.min(count + SIZE_PER_LOAD, totalCount)
    loadMore({
      limit: newLimit
    })
    // Remember user request for the next mount
    keptLimit = newLimit
  }

  const successCallback = () => {
    refetch()
  }

  if (error) {
    return (
      <div>
        <MyCode code={error} language='json' />
      </div>
    )
  }
  const progress = Math.ceil(100 * count / Math.min(totalCount, AUTOMATICALLY_LOAD_UP_TO))

  return (
    <div>
      <Components.MyHeadTags title='Offices' />
      <Card className='card-accent-offices' style={{ borderTopWidth: 1 }}>
        <ProgressBar now={progress} style={{ height: 2 }} variant='offices' />
        <Card.Header>
          <i className='fad fa-city' style={{ color: 'var(--primary)' }} />Offices
        </Card.Header>
        <Card.Body>
          <Table
            columns={columns}
            data={results}
            loading={loading && !results} // 2020-11-22: 'cache-and-network' loading doesn't work as expected
            totalCount={totalCount}
          />
        </Card.Body>
        <ProgressBar now={progress} style={{ height: 2 }} variant='secondary' />
        {results && totalCount > results.length &&
          <Card.Footer>
            <Components.LoadingButton loading={loadingMore} onClick={handleLoadMoreClick} label={`Load ${Math.min(totalCount - count, SIZE_PER_LOAD)} More (${count}/${totalCount})`} />
          </Card.Footer>}
        {Users.canCreate({ collection: Offices, user: currentUser }) && <AddButtonFooter successCallback={successCallback} />}
      </Card>
    </div>
  )
}

const accessOptions = {
  groups: ['participants', 'editors', 'admins'],
  redirect: '/welcome/new'
}

OfficesDataTable.displayName = 'WithAccess(OfficesDataTable)'

export default withAccess(accessOptions)(OfficesDataTable)
