import React from 'react'
import PropTypes from 'prop-types'
import FormGroup from 'react-bootstrap/FormGroup'
import SearchBar from './SearchBar'
import SearchClearButton from './SearchClearButton'

const GlobalFilter = (props) => {
  const { globalFilter, setGlobalFilter } = props

  return (
    <FormGroup className='input-group input-group-sm'>
      <SearchBar
        onChange={(e) => setGlobalFilter(e.target.value)}
        value={globalFilter || ''}
      />
      <SearchClearButton globalFilter={globalFilter} onClick={() => setGlobalFilter(undefined)} />
    </FormGroup>
  )
}

GlobalFilter.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired
}

export default GlobalFilter
