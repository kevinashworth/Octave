/* eslint-disable react/jsx-curly-newline */
import { Components, registerComponent, withAccess, withCurrentUser, withMulti2 } from 'meteor/vulcan:core'
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import {
  useGlobalFilter,
  useTable
} from 'react-table'
import every from 'lodash/every'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import moment from 'moment'
import GlobalFilter from '../common/react-table/GlobalFilter'
import Contacts from '../../modules/contacts/collection.js'
import withFilters from '../../modules/hocs/withFilters.js'
import { getAddress } from '../../modules/helpers.js'

const linkFormatter = (props) => {
  const row = props.row.original
  return (
    <Link to={`/${props.collection}/${row._id}/${row.slug}`}>
      {row.firstName} {row.middleName || null} <strong>{row.lastName}</strong>
    </Link>
  )
}

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
  tableProps.collection = 'contacts'

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

function ContactsNameOnly (props) {
  const [variant, setVariant] = useState(keptVariant)
  const [show, setShow] = useState(false)
  const {
    error, loading, results,
    contactTitleFilters, contactLocationFilters, contactUpdatedFilters
  } = props
  let contactFiltersRef

  const columns = [{
    Header: 'Name',
    accessor: 'displayName',
    Cell: linkFormatter
  }]

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
        const location = contact.theAddress.location ? contact.theAddress.location : getAddress({ contact }).location
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
    console.error('ContactsNameOnly error:', error)
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

  const setContactFiltersRef = (node) => {
    contactFiltersRef = node
  }

  const toggle = () => {
    setShow(!show)
    const cfr = contactFiltersRef
    if (!cfr) { return } // is null when modal opens, has value when closes
    const colors = Object.values(cfr.state) // includes unwanted state values, but no big deal to include them
    if (colors.includes('danger')) {
      setVariant('outline-danger')
    } else {
      setVariant('outline-primary')
    }
  }

  return (
    <>
      <Components.HeadTags title='V8: Contacts' />
      <Card className='card-accent-warning'>
        <Card.Header>
          <i className='icon-people' />Contacts
          <Button size='sm' variant={variant} className='ml-2' onClick={handleShow}>Filters</Button>
          <Modal show={show} onHide={handleHide}>
            <Modal.Header closeButton>Contact Filters</Modal.Header>
            <Modal.Body>
              <Components.ContactFilters ref={setContactFiltersRef} />
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
  collection: Contacts,
  fragmentName: 'ContactsDataTableFragment',
  input: {
    sort: {
      displayName: 'asc'
    }
  },
  limit: 1000
}

registerComponent({
  name: 'ContactsNameOnly',
  component: ContactsNameOnly,
  hocs: [
    [withAccess, accessOptions],
    withCurrentUser,
    withFilters,
    [withMulti2, multiOptions]
  ]
})
