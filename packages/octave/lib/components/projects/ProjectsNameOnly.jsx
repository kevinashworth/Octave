import { Components, withAccess, useMulti2 } from 'meteor/vulcan:core'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import { useGlobalFilter, useTable } from 'react-table'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import moment from 'moment'
import GlobalFilter from '../common/react-table/GlobalFilter'
import Projects from '../../modules/projects/collection.js'
import { linkFormatter } from '../common/react-table/helpers.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptVariant = 'outline-primary'
let keptGlobalFilter

function Table ({ columns, data }) {
  const tableProps = useTable(
    {
      columns,
      data,
      initialState: {
        globalFilter: keptGlobalFilter
      }
    },
    useGlobalFilter
  )

  const {
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state: { globalFilter }
  } = tableProps
  tableProps.collection = 'projects'

  // Remember state for the next mount
  useEffect(() => {
    return () => {
      keptGlobalFilter = globalFilter
    }
  })

  return (
    <>
      <GlobalFilter
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table className='react-table table table-striped table-hover table-sm'>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index}>
              {headerGroup.headers.map((column, index) => (
                // Return an array of prop objects and react-table will merge them appropriately
                <th key={index}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map(
            (row, index) => {
              prepareRow(row)
              return (
                <tr key={index}>
                  {row.cells.map((cell, index) => {
                    return (
                      <td key={index}>{cell.render('Cell')}</td>
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

function ProjectsNameOnly () {
  const [variant, setVariant] = useState(keptVariant)
  const [show, setShow] = useState(false)

  const projectPlatformFilters = useSelector(state => state.projectPlatformFilters)
  const projectStatusFilters = useSelector(state => state.projectStatusFilters)
  const projectTypeFilters = useSelector(state => state.projectTypeFilters)
  const projectUpdatedFilters = useSelector(state => state.projectUpdatedFilters)

  const multiOptions = {
    collection: Projects,
    fragmentName: 'ProjectsDataTableFragment',
    input: {
      sort: {
        sortTitle: 'asc'
      }
    },
    limit: 1000
  }
  const { error, loading, results } = useMulti2(multiOptions)

  let projectFiltersRef

  const columns = [{
    Header: 'Name',
    accessor: 'projectTitle',
    Cell: linkFormatter
  }]

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
      return filter(results, function (o) {
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

  // Remember state for the next mount
  useEffect(() => {
    return () => {
      keptVariant = variant
    }
  })

  if (loading) {
    return <Components.Loading />
  }

  if (error) {
    console.error('ProjectsNameOnly error:', error)
  }

  const handleHide = () => {
    if (show) {
      toggle()
    }
  }

  const handleShow = () => {
    if (!show) {
      toggle()
    }
  }

  const setProjectFiltersRef = (node) => {
    projectFiltersRef = node
  }

  const toggle = () => {
    setShow(!show)
    const cfr = projectFiltersRef
    if (!cfr) { return } // is null when modal opens, has value when closes
    const colors = Object.values(cfr.state) // includes unwanted state values, but no big deal to include them
    if (colors.includes('projects')) {
      setVariant('outline-projects')
    } else {
      setVariant('outline-primary')
    }
  }

  return (
    <>
      <Components.MyHeadTags title='Projects' />
      <Card className='card-accent-projects'>
        <Card.Header>
          <i className='fad fa-camera' style={{ color: 'var(--primary)' }} />Projects
          <Button size='sm' variant={variant} className='ml-2' onClick={handleShow}>Filters</Button>
          <Modal show={show} onHide={handleHide}>
            <Modal.Header closeButton>Project Filters</Modal.Header>
            <Modal.Body>
              <Components.ProjectFilters ref={setProjectFiltersRef} />
            </Modal.Body>
          </Modal>
        </Card.Header>
        <Card.Body>
          <Table columns={columns} data={filteredResults} />
        </Card.Body>
      </Card>
    </>
  )
}

const accessOptions = {
  groups: ['participants', 'editors', 'admins'],
  redirect: '/welcome/new'
}

ProjectsNameOnly.displayName = 'WithAccess(ProjectsNameOnly)'

export default withAccess(accessOptions)(ProjectsNameOnly)
