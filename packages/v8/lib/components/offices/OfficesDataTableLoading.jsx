/* eslint-disable react/jsx-curly-newline */
import { Components } from 'meteor/vulcan:core'
import React from 'react'
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
import DefaultColumnFilter from '../common/react-table/DefaultColumnFilter'
import GlobalFilter from '../common/react-table/GlobalFilter'
import Pagination from '../common/react-table/Pagination'
import { CaretUnsorted } from '../common/react-table/styled.js'
import MyLoading from '../common/MyLoading'
import { INITIAL_SIZE_PER_PAGE, LOADING_OFFICES_DATA } from '../../modules/constants.js'

const keptState = {
  filters: [{
    id: 'displayName',
    value: ''
  }, {
    id: 'fullAddress',
    value: ''
  }],
  pageIndex: 0,
  pageSize: INITIAL_SIZE_PER_PAGE
}

function AddButtonFooter () {
  return (
    <Card.Footer>
      <Components.ModalTrigger title='New Office' label='Add an Office'>
        {' '}
      </Components.ModalTrigger>
    </Card.Footer>
  )
}

function Table ({ columns, data }) {
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
      initialState: {
        filters: keptState.filters,
        pageIndex: keptState.pageIndex,
        pageSize: keptState.pageSize
      }
    },
    useFilters,
    useGlobalFilter,
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
    state: { globalFilter }
  } = tableProps

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
                      <CaretUnsorted className='fa fa-sort' />
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
                      <td {...cell.getCellProps()} key={index}><MyLoading variant={index === 0 && 'primary'} /></td>
                    )
                  })}
                </tr>
              )
            }
          )}
        </tbody>
      </table>
    </>
  )
}

function OfficesDataTableLoading (props) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'displayName',
        style: {
          width: '30%'
        }
      },
      {
        Header: 'Address',
        accessor: 'fullAddress'
      },
      {
        Header: 'Updated',
        accessor: 'updatedAt',
        disableFilters: true,
        style: {
          textAlign: 'right',
          width: '6.6em'
        }
      }
    ],
    []
  )

  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8: Offices' />
      <Card className='card-accent-primary'>
        <Card.Header>
          <i className='icon-briefcase' />Offices
        </Card.Header>
        <Card.Body>
          <Table columns={columns} data={LOADING_OFFICES_DATA} />
        </Card.Body>
        <AddButtonFooter />
      </Card>
    </div>
  )
}

export default OfficesDataTableLoading
