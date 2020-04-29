import { Components, registerComponent, withAccess, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { Component, PureComponent } from 'react'
// import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import styled from 'styled-components'
import {
  useTable,
  usePagination,
  useSortBy
} from 'react-table'
// import { SIZE_PER_PAGE_LIST_SEED } from '../../modules/constants.js'
// import { dateFormatter, renderShowsTotal } from '../../modules/helpers.js'
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

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }

    td {
      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
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
      initialState: { pageIndex: 2 }
    },
    usePagination,
    useSortBy
  )

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
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
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
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

    // const linkFormatter = (cell, row) => {
    //   return (
    //     <Link to={`/offices/${row._id}/${row.slug}`}>
    //       {cell}
    //     </Link>
    //   )
    // }

    const columns = React.useMemo(
      () => [
        {
          Header: 'Name',
          accessor: 'displayName'
        },
        {
          Header: 'Address',
          accessor: 'fullAddress'
        },
        {
          Header: 'Updated',
          accessor: 'updatedAt'
        },
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
            <Styles>
              <Table columns={columns} data={this.state.results} />
            </Styles>
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
