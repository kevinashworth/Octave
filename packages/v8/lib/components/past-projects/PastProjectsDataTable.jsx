import { Components, registerComponent, withAccess, withMulti2 } from 'meteor/vulcan:core'
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import {
  useGlobalFilter,
  useTable,
  usePagination,
  useSortBy
} from 'react-table'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import moment from 'moment'
import MyCode from '../common/MyCode'
import MyLoading from '../common/MyLoading'
import GlobalFilter from '../common/react-table/GlobalFilter'
import Pagination from '../common/react-table/Pagination'
import { dateFormatter, linkFormatter, titleSortFn } from '../common/react-table/helpers.js'
import { CaretNone, CaretSort } from '../common/react-table/styled.js'
import withFilters from '../../modules/hocs/withFilters.js'
import PastProjects from '../../modules/past-projects/collection.js'
import { INITIAL_SIZE_PER_PAGE, LOADING_PROJECTS_DATA } from '../../modules/constants.js'

const INITIAL_LOAD = 50
const SIZE_PER_LOAD = 150
const AUTOMATICALLY_LOAD_UP_TO = 500
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

let keptLimit = null

const Table = ({ columns, data, loading, onRowClick }) => {
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
    state: { filters, globalFilter, pageIndex, pageSize, sortBy }
  } = tableProps
  tableProps.collection = 'past-projects'

  const rowClickHandler = (e, columnIndex, row) => {
    e.stopPropagation()
    if (columnIndex !== 0) {
      onRowClick(true, row.original)
    }
  }

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
      <Pagination {...tableProps} />
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
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <CaretSort className='fad fa-sort-down' />
                          : <CaretSort className='fad fa-sort-up' />
                        : column.canSort
                          ? <CaretSort className='fad fa-sort' />
                          : <CaretNone className='fad fa-sort' />}
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

const PastProjectsDataTable = (props) => {
  const [show, setShow] = useState(false) // show Modal
  const [project, setProject] = useState(null) // Modal project
  const rowClickHandler = (show, project) => {
    setShow(show)
    setProject(project)
  }

  const {
    count, error, loading, loadMore, networkStatus, results, totalCount,
    pastProjectTypeFilters, pastProjectStatusFilters, pastProjectUpdatedFilters
  } = props
  const myLoadingMore = networkStatus === 2

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
      var typeFilters = []
      pastProjectTypeFilters.forEach(filter => {
        if (filter.value) { typeFilters.push(filter.projectType) }
      })
      var statusFilters = []
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
    if (keptLimit && count < keptLimit && !loading && !myLoadingMore) {
      loadMore({
        limit: keptLimit
      })
    } else if (count < totalCount && count < AUTOMATICALLY_LOAD_UP_TO && !loading && !myLoadingMore) {
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
    // Remember state for the next mount
    keptLimit = newLimit
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
      <Components.HeadTags title='V8: Past Projects' />
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
      <Card className='card-accent-danger' style={{ borderTopWidth: 1 }}>
        <ProgressBar now={progress} style={{ height: 2 }} variant='danger' />
        <Card.Header>
          <i className='fad fa-camera-retro' />Past Projects
          <Components.PastProjectFilters />
        </Card.Header>
        <Card.Body>
          <Table
            onRowClick={rowClickHandler}
            columns={columns}
            data={filteredResults}
            loading={loading}
          />
        </Card.Body>
        {results && totalCount > results.length &&
          <Card.Footer>
            <Components.LoadingButton loading={myLoadingMore} onClick={handleLoadMoreClick} label={`Load ${Math.min(totalCount - count, SIZE_PER_LOAD)} More (${count}/${totalCount})`} />
          </Card.Footer>}
        <ProgressBar now={progress} style={{ height: 2 }} variant='secondary' />
      </Card>
    </div>
  )
}

const accessOptions = {
  groups: ['participants', 'admins'],
  redirect: '/welcome/new'
}

const multiOptions = {
  collection: PastProjects,
  fragmentName: 'PastProjectsDataTableFragment',
  limit: INITIAL_LOAD,
  input: {
    sort: {
      updatedAt: 'desc'
    }
  }
}

registerComponent({
  name: 'PastProjectsDataTable',
  component: PastProjectsDataTable,
  hocs: [
    [withAccess, accessOptions],
    withFilters,
    [withMulti2, multiOptions]
  ]
})
