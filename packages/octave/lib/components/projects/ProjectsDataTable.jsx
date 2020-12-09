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
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import moment from 'moment'
import { createBreakpointHook } from '@restart/hooks/useBreakpoint'
import MyCode from '../common/MyCode'
import MyLoading from '../common/MyLoading'
import GlobalFilter from '../common/react-table/GlobalFilter'
import Pagination from '../common/react-table/Pagination'
import { dateFormatter, linkFormatter, mySortFn, titleSortFn } from '../common/react-table/helpers.js'
import Caret from '../common/react-table/Caret'
import { useUnmount } from '../../hooks'
import Projects from '../../modules/projects/collection.js'
import { INITIAL_SIZE_PER_PAGE, LOADING_PROJECTS_DATA } from '../../modules/constants.js'

const SIZE_PER_LOAD = 200
const AUTOMATICALLY_LOAD_UP_TO = 600
const hiddenColumns = ['allAddresses', 'allContactNames', 'notes', 'sortTitle']

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
      <Components.ModalTrigger label='Add a Project' title='New Project'>
        <Components.ProjectsNewForm successCallback={successCallback} />
      </Components.ModalTrigger>
    </Card.Footer>
  )
}

const Table = ({ columns, data, loading, onRowClick, totalCount }) => {
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
  tableProps.collection = 'projects'

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

const ProjectsDataTable = () => {
  const { count, error, loading, loadingMore, loadMore, refetch, results, totalCount } = useMulti2({
    collection: Projects,
    fragmentName: 'ProjectsDataTableFragment',
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

  const projectPlatformFilters = useSelector(state => state.projectPlatformFilters)
  const projectStatusFilters = useSelector(state => state.projectStatusFilters)
  const projectTypeFilters = useSelector(state => state.projectTypeFilters)
  const projectUpdatedFilters = useSelector(state => state.projectUpdatedFilters)

  const { currentUser } = useCurrentUser()

  const useBreakpoint = createBreakpointHook({
    xxxl: 1800,
    xxxxl: 2100
  })
  const isWide = useBreakpoint({ xxxl: 'up' })
  const isVeryWide = useBreakpoint({ xxxxl: 'up' })

  const columns = useMemo(() => {
    const arrayOfColumns = [
      {
        Header: 'Project Title',
        accessor: 'projectTitle',
        Cell: linkFormatter,
        sortType: titleSortFn
      },
      {
        Header: 'Casting',
        accessor: 'casting',
        sortType: mySortFn
      },
      {
        Header: 'Network',
        accessor: 'network',
        sortType: mySortFn
      },
      {
        Header: 'Type',
        accessor: 'projectType'
      }
    ]
    isWide && arrayOfColumns.push(
      {
        Header: 'Main Shooting Location',
        accessor: 'shootingLocation',
        sortType: mySortFn
      }
    )
    isVeryWide && arrayOfColumns.push(
      {
        Header: 'Notes',
        accessor: 'summary',
        disableSortBy: true,
        style: {
          width: '33%'
        }
      }
    )
    arrayOfColumns.push(
      {
        Header: 'Status',
        accessor: 'status',
        style: {
          width: '6.6em'
        }
      }, {
        Header: 'Created',
        accessor: 'createdAt',
        Cell: dateFormatter,
        style: {
          textAlign: 'right',
          width: '6.6em'
        }
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
    )
    return arrayOfColumns
  },
  [isWide, isVeryWide]
  )

  const filteredResults = useMemo(
    () => {
      const typeFilters = []
      projectTypeFilters.forEach(filter => {
        if (filter.value) { typeFilters.push(filter.projectType) }
      })
      const statusFilters = []
      projectStatusFilters.forEach(filter => {
        if (filter.value) { statusFilters.push(filter.projectStatus) }
      })
      const platformFilters = []
      projectPlatformFilters.forEach(filter => {
        if (filter.value) { platformFilters.push(filter.projectPlatform) }
      })
      let momentNumber = 100
      let momentPeriod = 'years'
      projectUpdatedFilters.some(filter => {
        if (filter.value) {
          momentNumber = filter.momentNumber
          momentPeriod = filter.momentPeriod
          return true
        } else {
          return false
        }
      })
      return filter(results, (o) => {
        const now = moment()
        const dateToCompare = o.updatedAt ? o.updatedAt : o.createdAt
        const displayThis = moment(dateToCompare).isAfter(now.subtract(momentNumber, momentPeriod).startOf('day'))
        return displayThis &&
          includes(statusFilters, o.status) &&
          includes(typeFilters, o.projectType) &&
          includes(platformFilters, o.platformType)
      })
    }, [projectTypeFilters, projectStatusFilters, projectPlatformFilters, projectUpdatedFilters, results]
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
    // Remember for the next mount if user requests more
    keptLimit = newLimit
  }

  const rowClickHandler = (show, project) => {
    setShow(show)
    setProject(project)
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
      <Components.MyHeadTags title='Projects' />
      {project &&
        <Modal show={show} onHide={handleHide}>
          <Modal.Header closeButton>
            <Modal.Title>
              <Link to={`/projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Components.ProjectModal document={project} />
          </Modal.Body>
        </Modal>}
      <Card className='card-accent-projects' style={{ borderTopWidth: 1 }}>
        <ProgressBar now={progress} style={{ height: 2 }} variant='projects' />
        <Card.Header>
          <i className='fad fa-camera' style={{ color: 'var(--primary)' }} />Projects
          <Components.ProjectFilters />
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
        <ProgressBar now={progress} style={{ height: 2 }} variant='secondary' />
        {Users.canCreate({ collection: Projects, user: currentUser }) && <AddButtonFooter successCallback={successCallback} />}
      </Card>
    </div>
  )
}

const accessOptions = {
  groups: ['participants', 'editors', 'admins'],
  redirect: '/welcome/new'
}

ProjectsDataTable.displayName = 'WithAccess(ProjectsDataTable)'

export default withAccess(accessOptions)(ProjectsDataTable)
