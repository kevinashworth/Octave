import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import RBPagination from 'react-bootstrap/Pagination'
import { PAGINATION_SIZE } from './constants.js'
import { getPageOptionsVisible } from './helpers.js'
import { SIZE_PER_PAGE_LIST_SEED } from '../../../modules/constants.js'

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
    state: { pageIndex, pageSize }
  } = props
  const length = props.rows.length

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen(prevState => !prevState)

  const pageOptionsVisible = getPageOptionsVisible({ pageCount, pageIndex, pageOptions })

  return (
    <div className='d-flex align-items-center'>
      <div className='mb-3'>
        Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, length)} out of {length} &nbsp;&nbsp;
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
            <RBPagination.First disabled={pageIndex === 0} onClick={() => gotoPage(0)} />
          }
          <RBPagination.Prev disabled={!canPreviousPage} onClick={() => previousPage()} />
          {pageOptionsVisible.map(page => (
            <RBPagination.Item key={page} className={page === pageIndex ? 'active' : ''} onClick={() => gotoPage(page)}>
              {page + 1}
            </RBPagination.Item>
          ))}
          <RBPagination.Next disabled={!canNextPage} onClick={() => nextPage()} />
          {(pageOptionsVisible.length >= PAGINATION_SIZE) &&
            <RBPagination.Last disabled={pageIndex === (pageCount - 1)} onClick={() => gotoPage(pageCount - 1)} />
          }
        </RBPagination>
      </div>
    </div>
  )
}

export default Pagination
