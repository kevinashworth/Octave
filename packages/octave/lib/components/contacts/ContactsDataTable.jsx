import { Components, withAccess, useCurrentUser, useMulti2 } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import every from 'lodash/every'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import moment from 'moment'
import MyCode from '../common/MyCode'
import MyLoading from '../common/MyLoading'
import GlobalFilter from '../common/react-table/GlobalFilter'
import Pagination from '../common/react-table/Pagination'
import { dateFormatter, linkFormatter, nameSortFn } from '../common/react-table/helpers.js'
import Caret from '../common/react-table/Caret'
import { useUnmount } from '../../hooks'
import Contacts from '../../modules/contacts/collection.js'
import { getAddress } from '../../modules/helpers.js'
import { INITIAL_SIZE_PER_PAGE, LOADING_CONTACTS_DATA } from '../../modules/constants.js'

const SIZE_PER_LOAD = 200
const AUTOMATICALLY_LOAD_UP_TO = 600
const hiddenColumns = ['allLinks', 'allAddresses', 'body']

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
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
      <Components.ModalTrigger label='Add a Contact' title='New Contact'>
        <Components.ContactsNewForm successCallback={successCallback} />
      </Components.ModalTrigger>
    </Card.Footer>
  )
}

const Table = ({ columns, data, loading, onRowClick, totalCount }) => {
  const tableProps = useTable(
    {
      columns,
      data: loading ? LOADING_CONTACTS_DATA : data,
      disableMultiSort: true,
      disableSortRemove: true,
      initialState: {
        globalFilter: keptState.globalFilter,
        hiddenColumns: hiddenColumns,
        pageIndex: keptState.pageIndex,
        pageSize: keptState.pageSize,
        sortBy: keptState.sortBy
      }
    },
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
    state: { globalFilter, pageIndex, pageSize, sortBy }
  } = tableProps
  tableProps.collection = 'contacts'

  const rowClickHandler = (e, columnIndex, row) => {
    e.stopPropagation()
    if (columnIndex !== 0) {
      onRowClick(true, row.original)
    }
  }

  useEffect(() => {
    keptState = {
      globalFilter,
      pageIndex,
      pageSize,
      sortBy
    }
  }, [globalFilter, pageIndex, pageSize, sortBy])

  useUnmount(() => {
    keptState = {
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
                      <td
                        {...cell.getCellProps()}
                        key={index}
                        onClick={(e) => rowClickHandler(e, index, row)}
                      >
                        {loading ? <MyLoading variant={index === 0 && 'primary'} /> : cell.render('Cell')}
                      </td>
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

function ContactsDataTable () {
  const { count, error, loading, loadingMore, loadMore, refetch, results, totalCount } = useMulti2({
    collection: Contacts,
    fragmentName: 'ContactsDataTableFragment',
    input: {
      enableCache: true,
      limit: keptLimit
    },
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })

  const [show, setShow] = useState(false) // show Modal
  const [contact, setContact] = useState(null) // Modal contact

  const contactLocationFilters = useSelector(state => state.contactLocationFilters)
  const contactTitleFilters = useSelector(state => state.contactTitleFilters)
  const contactUpdatedFilters = useSelector(state => state.contactUpdatedFilters)

  const { currentUser } = useCurrentUser()

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'displayName',
        Cell: linkFormatter,
        sortType: nameSortFn,
        style: {
          width: '25%'
        }
      }, {
        Header: 'Title',
        accessor: 'title'
      }, {
        Header: 'Address',
        accessor: 'addressString'
      }, {
        Header: 'Updated',
        accessor: 'updatedAt',
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

  const filteredResults = useMemo(
    () => {
      const titleFilters = []
      contactTitleFilters.forEach(filter => {
        if (filter.value) { titleFilters.push(filter.contactTitle) }
      })
      const otherFilters = []
      contactTitleFilters.forEach(filter => {
        if (!filter.value) { otherFilters.push(filter.contactTitle) }
      })
      const locationFilters = []
      contactLocationFilters.forEach(filter => {
        if (filter.value) { locationFilters.push(filter.contactLocation) }
      })
      let momentNumber = 100
      let momentPeriod = 'years'
      contactUpdatedFilters.forEach(filter => {
        if (filter.value) {
          momentNumber = filter.momentNumber
          momentPeriod = filter.momentPeriod
        }
      })
      return filter(results, function (contact) {
        // compare current time generously, so start of day, i.e., filter plus up to 23:59
        const now = moment()
        const dateToCompare = contact.updatedAt ? contact.updatedAt : contact.createdAt
        const displayThis = moment(dateToCompare).isAfter(now.subtract(momentNumber, momentPeriod).startOf('day'))
        if (!displayThis) {
          return false
        }
        const location = (contact.theAddress && contact.theAddress.location) ? contact.theAddress.location : getAddress({ contact }).location
        // if "Other" is not checked, filter per normal via titleFilters:
        if (!(includes(titleFilters, 'Other'))) {
          return displayThis &&
              includes(locationFilters, location) &&
              includes(titleFilters, contact.title)
        } else if (every(titleFilters, { value: true })) {
          // if "Other" is checked and so are all the titles, do not filter by title
          return displayThis &&
            includes(locationFilters, location)
        } else {
          // if "Other" is checked and some are not checked, eliminate based on titles in contactTitleFilters
          return displayThis &&
              includes(locationFilters, location) &&
              !includes(otherFilters, contact.title)
        }
      })
    }, [contactTitleFilters, contactLocationFilters, contactUpdatedFilters, results]
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

  const handleHide = () => {
    if (show) {
      setShow(false)
    }
  }

  const handleLoadMoreClick = (e) => {
    e.preventDefault()
    const newLimit = Math.min(count + SIZE_PER_LOAD, totalCount)
    loadMore({
      limit: newLimit
    })
    // Remember user request for the next mount
    keptLimit = newLimit
  }

  const rowClickHandler = (show, project) => {
    setShow(show)
    setContact(project)
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
      <Components.MyHeadTags title='Contacts' />
      {contact &&
        <Modal show={show} onHide={handleHide}>
          <Modal.Header closeButton>
            <Modal.Title>
              <Link to={`/contacts/${contact._id}/${contact.slug}`}>{contact.displayName}</Link>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Components.ContactModal document={contact} />
          </Modal.Body>
        </Modal>}
      <Card className='card-accent-contacts' style={{ borderTopWidth: 1 }}>
        <ProgressBar now={progress} style={{ height: 2 }} variant='contacts' />
        <Card.Header>
          <i className='fad fa-address-book' />
          Contacts
          <Components.ContactFilters />
        </Card.Header>
        <Card.Body>
          <Table
            columns={columns}
            data={filteredResults}
            loading={loading && !results} // 2020-11-22: 'cache-and-network' loading doesn't work as expected
            onRowClick={rowClickHandler}
            totalCount={totalCount}
          />
        </Card.Body>
        {results && (totalCount > results.length) &&
          <Card.Footer>
            <Components.LoadingButton
              label={`Load ${Math.min(totalCount - count, SIZE_PER_LOAD)} More (${count}/${totalCount})`}
              loading={loadingMore}
              onClick={handleLoadMoreClick}
            />
          </Card.Footer>}
        <ProgressBar now={progress} style={{ height: 2 }} variant='secondary' />
        {Users.canCreate({ collection: Contacts, user: currentUser }) && <AddButtonFooter successCallback={successCallback} />}
      </Card>
    </div>
  )
}

const accessOptions = {
  groups: ['participants', 'editors', 'admins'],
  redirect: '/welcome/new'
}

ContactsDataTable.displayName = 'WithAccess(ContactsDataTable)'

export default withAccess(accessOptions)(ContactsDataTable)
