import { Components, withAccess, useMulti2 } from 'meteor/vulcan:core'
import React, { useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import { useGlobalFilter, useTable } from 'react-table'
import GlobalFilter from '../common/react-table/GlobalFilter'
import { linkFormatter } from '../common/react-table/helpers.js'
import Offices from '../../modules/offices/collection.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  globalFilter: undefined
}

function Table ({ columns, data }) {
  const tableProps = useTable(
    {
      columns,
      data,
      initialState: {
        globalFilter: keptState.globalFilter
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
  tableProps.collection = 'offices'

  // Remember state for the next mount
  useEffect(() => {
    return () => {
      keptState = {
        globalFilter
      }
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

function OfficesNameOnly () {
  const multiOptions = {
    collection: Offices,
    fragmentName: 'OfficesDataTableFragment',
    input: {
      sort: {
        displayName: 'asc'
      }
    },
    limit: 1000
  }
  const { error, loading, results } = useMulti2(multiOptions)

  const columns = [{
    Header: 'Name',
    accessor: 'displayName',
    Cell: linkFormatter
  }]

  if (loading) {
    return <Components.Loading />
  }

  if (error) {
    console.error('OfficesNameOnly error:', error)
  }

  return (
    <>
      <Components.MyHeadTags title='Offices' />
      <Card className='card-accent-offices'>
        <Card.Header>
          <i className='fad fa-city' style={{ color: 'var(--primary)' }} />Offices
        </Card.Header>
        <Card.Body>
          <Table columns={columns} data={results} />
        </Card.Body>
      </Card>
    </>
  )
}

const accessOptions = {
  groups: ['participants', 'editors', 'admins'],
  redirect: '/welcome/new'
}

OfficesNameOnly.displayName = 'WithAccess(OfficesNameOnly)'

export default withAccess(accessOptions)(OfficesNameOnly)
