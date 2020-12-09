import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'
import RBPagination from 'react-bootstrap/Pagination'
import { getPageOptionsVisible } from './helpers.js'
import { PAGINATION_SIZE, SIZE_PER_PAGE_LIST_SEED } from '../../../modules/constants.js'

const Pagination = (props) => {
  const {
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    rows: { length },
    totalCount
  } = props

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen(prevState => !prevState)

  const pageOptionsVisible = getPageOptionsVisible({ pageCount, pageIndex, pageOptions })

  useEffect(() => {
    // when globalFilter reduces pageCount
    if (pageIndex >= pageCount) {
      gotoPage(pageCount - 1)
    }
  })

  return (
    <div className='d-flex align-items-center'>
      <div className='mb-3'>
        Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, length)} out of {length}{' '}
        {totalCount && totalCount > length && `(${totalCount} total)`} &nbsp;&nbsp;
      </div>
      <div className='mb-3'>
        <Dropdown show={dropdownOpen} onToggle={toggle}>
          <Dropdown.Toggle variant='secondary'>
            {pageSize}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header disabled>Page Size</Dropdown.Header>
            {SIZE_PER_PAGE_LIST_SEED.map(pageSize => (
              <Dropdown.Item key={pageSize.text} onClick={e => setPageSize(pageSize.value)}>
                {pageSize.text}
              </Dropdown.Item>
            ))}
            <Dropdown.Item key='All' onClick={e => setPageSize(length)}>All</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className='ml-auto'>
        <RBPagination aria-label='Page-by-page navigation of the Offices table'>
          {(pageOptionsVisible.length >= PAGINATION_SIZE) &&
            <RBPagination.First disabled={pageIndex === 0} onClick={() => gotoPage(0)} />}
          <RBPagination.Prev disabled={!canPreviousPage} onClick={() => previousPage()} />
          {pageOptionsVisible.map(page => (
            <RBPagination.Item key={page} className={page === pageIndex ? 'active' : ''} onClick={() => gotoPage(page)}>
              {page + 1}
            </RBPagination.Item>
          ))}
          <RBPagination.Next disabled={!canNextPage} onClick={() => nextPage()} />
          {(pageOptionsVisible.length >= PAGINATION_SIZE) &&
            <RBPagination.Last disabled={pageIndex === (pageCount - 1)} onClick={() => gotoPage(pageCount - 1)} />}
        </RBPagination>
      </div>
    </div>
  )
}

Pagination.propTypes = {
  rows: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
  totalCount: PropTypes.number
}

export default Pagination
