import { Components, registerComponent, withAccess, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { Component, PureComponent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import styled from 'styled-components'
import {
  useTable,
  usePagination,
  useSortBy
} from 'react-table'
import { DATE_FORMAT_SHORT, SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
import moment from 'moment'
// import { dateFormatter, renderShowsTotal } from '../../modules/helpers.js'
import Offices from '../../modules/offices/collection.js'

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

function Pagination({ length, pageIndex, pageSize, setPageSize }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  return (
    <>
    <span>Showing {pageIndex*pageSize+1} to {Math.min((pageIndex+1)*pageSize,length)} out of {length} &nbsp;&nbsp;</span>
    <span className='d-inline-block'>
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
    </span>
  </>
  )
}

function Table({ columns, data }) {
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
    state: { pageIndex, pageSize },
  } = useTable(
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

  return (
    <>
    <Pagination length={data.length} pageIndex={pageIndex} pageSize={pageSize} setPageSize={setPageSize} />
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
      <Pagination length={data.length} pageIndex={pageIndex} pageSize={pageSize} setPageSize={setPageSize} />
      <ul className="pagination react-bootstrap-table-page-btns-ul">
        <li className="active page-item" title="1"><a href="#" className="page-link">1</a></li>
        <li className="page-item" title="2"><a href="#" className="page-link">2</a></li>
        <li className="page-item" title="3"><a href="#" className="page-link">3</a></li>
        <li className="page-item" title="4"><a href="#" className="page-link">4</a></li>
        <li className="page-item" title="5"><a href="#" className="page-link">5</a></li>
        <li className="page-item" title="next page"><a href="#" className="page-link">›</a></li>
        <li className="page-item" title="last page"><a href="#" className="page-link">»</a></li>
      </ul>
      <hr />
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
      </div>
    </>
  )
}

function OfficesDataTable (props) {
  const [results, setResults] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const { count, currentUser, loadingMore, loadMore } = props
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


  // const pageChangeHandler = (page, sizePerPage) => {
  //   this.setState({ page, sizePerPage })
  // }
  //
  // const sizePerPageChangeHandler = (sizePerPage, page) => {
  //   this.setState({ sizePerPage, page })
  // }
  //
  // const sortChangeHandler = (sortField, sortOrder) => {
  //   this.setState({ sortField, sortOrder })
  // }
  //
  const linkFormatter = ({ cell, row }) => {
    return (
      <Link to={`/offices/${row.original._id}/${row.original.slug}`}>
        {cell.value}
      </Link>
    )
  }

  const dateFormatter = ({cell, row}) => {
    let theDate
    if (!cell.value) { // i.e. there is only a createdAt, not an updatedAt
      theDate = row.original.createdAt
    } else {
      theDate = cell.value
    }
    return moment(theDate).format(DATE_FORMAT_SHORT)
  }

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
