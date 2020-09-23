/* eslint-disable react/jsx-curly-newline */
import { Components, registerComponent, withAccess, withCurrentUser, withMulti2 } from 'meteor/vulcan:core'
import React, { useEffect, useMemo, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import {
  useGlobalFilter,
  useTable
} from 'react-table'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import moment from 'moment'
import GlobalFilter from '../common/react-table/GlobalFilter'
import Projects from '../../modules/projects/collection.js'
import withFilters from '../../modules/hocs/withFilters.js'
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

function ProjectsNameOnly (props) {
  const [variant, setVariant] = useState(keptVariant)
  const [show, setShow] = useState(false)
  const {
    error, loading, results,
    projectTypeFilters, projectStatusFilters, projectPlatformFilters, projectUpdatedFilters
  } = props
  let projectFiltersRef

  const columns = [{
    Header: 'Name',
    accessor: 'projectTitle',
    Cell: linkFormatter
  }]

  const filteredResults = useMemo(
    () => {
      var typeFilters = []
      projectTypeFilters.forEach(filter => {
        if (filter.value) { typeFilters.push(filter.projectType) }
      })
      var statusFilters = []
      projectStatusFilters.forEach(filter => {
        if (filter.value) { statusFilters.push(filter.projectStatus) }
      })
      var platformFilters = []
      projectPlatformFilters.forEach(filter => {
        if (filter.value) { platformFilters.push(filter.projectPlatform) }
      })
      var momentNumber = 100
      var momentPeriod = 'years'
      projectUpdatedFilters.some(filter => {
        if (filter.value) {
          momentNumber = filter.momentNumber
          momentPeriod = filter.momentPeriod
          return true
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
      <Components.HeadTags title='V8: Projects' />
      <Card className='card-accent-projects'>
        <Card.Header>
          <i className='icon-people' />Projects
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
  groups: ['participants', 'admins'],
  redirect: '/welcome/new'
}

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

registerComponent({
  name: 'ProjectsNameOnly',
  component: ProjectsNameOnly,
  hocs: [
    [withAccess, accessOptions],
    withCurrentUser,
    withFilters,
    [withMulti2, multiOptions]
  ]
})
