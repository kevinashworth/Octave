import { Components, withAccess, useMulti2 } from 'meteor/vulcan:core'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import moment from 'moment'
import MyCode from '../common/MyCode'
import MyLoading from '../common/MyLoading'
import GlobalFilter from '../common/react-table/GlobalFilter'
import Pagination from '../common/react-table/Pagination'
import { dateFormatter, linkFormatter, titleSortFn } from '../common/react-table/helpers.js'
import Caret from '../common/react-table/Caret'
import { useUnmount } from '../../hooks'
import PastProjects from '../../modules/past-projects/collection.js'
import { INITIAL_SIZE_PER_PAGE, LOADING_PROJECTS_DATA } from '../../modules/constants.js'

const SIZE_PER_LOAD = 200
const AUTOMATICALLY_LOAD_UP_TO = 600
const hiddenColumns = ['allAddresses', 'allContactNames', 'notes', 'sortTitle', 'summary']

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

const Table = ({ columns, data, loading, totalCount, onRowClick }) => {
  const tableProps = useTable(
    {
      columns,
      data: loading ? LOADING_PROJECTS_DATA : data,
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
  tableProps.collection = 'past-projects'

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
                    {
                      ...column.getSortByToggleProps(),
                      style: column.style,
                      title: null
                    }
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

const PastProjectsDataTable = () => {
  const { count, error, loading, loadingMore, loadMore, results, totalCount } = useMulti2({
    collection: PastProjects,
    fragmentName: 'PastProjectsDataTableFragment',
    input: {
      enableCache: true,
      limit: keptLimit
    },
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })

  const [show, setShow] = useState(false) // show Modal
  const [project, setProject] = useState(null) // Modal project

  const pastProjectStatusFilters = useSelector(state => state.pastProjectStatusFilters)
  const pastProjectTypeFilters = useSelector(state => state.pastProjectTypeFilters)
  const pastProjectUpdatedFilters = useSelector(state => state.pastProjectUpdatedFilters)

  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'projectTitle',
        Cell: linkFormatter,
        sortType: titleSortFn,
        style: {
          width: '30%'
        }
      }, {
        Header: 'Casting',
        accessor: 'casting'
      }, {
        Header: 'Network',
        accessor: 'network'
      }, {
        Header: 'Type',
        accessor: 'projectType'
      }, {
        Header: 'Status',
        accessor: 'status'
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
      const typeFilters = []
      pastProjectTypeFilters.forEach(filter => {
        if (filter.value) { typeFilters.push(filter.projectType) }
      })
      const statusFilters = []
      pastProjectStatusFilters.forEach(filter => {
        if (filter.value) { statusFilters.push(filter.pastProjectStatus) }
      })
      let momentNumber = '100'
      let momentPeriod = 'years'
      pastProjectUpdatedFilters.forEach(filter => {
        if (filter.value) {
          momentNumber = filter.momentNumber
          momentPeriod = filter.momentPeriod
        }
      })

      return filter(results, (o) => {
        const now = moment()
        const dateToCompare = o.updatedAt ? o.updatedAt : o.createdAt
        const displayThis = moment(dateToCompare).isAfter(now.subtract(momentNumber, momentPeriod).startOf('day'))
        return displayThis &&
          includes(statusFilters, o.status) &&
          includes(typeFilters, o.projectType)
      })
    }, [pastProjectTypeFilters, pastProjectStatusFilters, pastProjectUpdatedFilters, results]
  )

  useEffect(() => {
    if (keptLimit && count < keptLimit && !loading && !loadingMore) {
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
    setProject(project)
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
      <Components.MyHeadTags title='Past Projects' />
      {project &&
        <Modal show={show} onHide={handleHide}>
          <Modal.Header closeButton>
            <Modal.Title>
              <Link to={`/past-projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Components.ProjectModal document={project} />
          </Modal.Body>
        </Modal>}
      <Card className='card-accent-pastprojects' style={{ borderTopWidth: 1 }}>
        <ProgressBar now={progress} style={{ height: 2 }} variant='pastprojects' />
        <Card.Header>
          <i className='fad fa-camera-retro' style={{ color: 'var(--primary)' }} />Past Projects
          <Components.PastProjectFilters />
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
        {results && totalCount > results.length &&
          <Card.Footer>
            <Components.LoadingButton loading={loadingMore} onClick={handleLoadMoreClick} label={`Load ${Math.min(totalCount - count, SIZE_PER_LOAD)} More (${count}/${totalCount})`} />
          </Card.Footer>}
        <ProgressBar now={progress} style={{ height: 2 }} variant='pastprojects' />
      </Card>
    </div>
  )
}

const accessOptions = {
  groups: ['participants', 'editors', 'admins'],
  redirect: '/welcome/new'
}

PastProjectsDataTable.displayName = 'WithAccess(PastProjectsDataTable)'

export default withAccess(accessOptions)(PastProjectsDataTable)
