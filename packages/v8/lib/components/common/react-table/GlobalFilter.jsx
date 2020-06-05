import React from 'react'
import FormGroup from 'react-bootstrap/FormGroup'
import SearchBar from './SearchBar'
import SearchClearButton from './SearchClearButton'

const GlobalFilter = (props) => {
  const { globalFilter, setGlobalFilter } = props
  return (
    <FormGroup className='input-group input-group-sm'>
      <SearchBar
        onChange={e => {
          const searchText = e.target.value || undefined
          setGlobalFilter(searchText)
        }}
        value={globalFilter || ''}
      />
      <SearchClearButton globalFilter={globalFilter} onClick={() => setGlobalFilter('')} />
    </FormGroup>
  )
}

export default GlobalFilter
