import React, { useEffect } from 'react'
import FormGroup from 'react-bootstrap/FormGroup'
import SearchBar from './SearchBar'
import SearchClearButton from './SearchClearButton'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  globalFilterValue: ''
}

const GlobalFilter = (props) => {
  const { globalFilter, setGlobalFilter } = props
  let globalFilterValue = globalFilter || ''
  if (keptState.globalFilterValue && keptState.globalFilterValue.length) {
    globalFilterValue = keptState.globalFilterValue
  }
  const isGlobalFilter = globalFilterValue.length > 0

  // Remember state for the next mount
  useEffect(() => {
    return () => {
      keptState = {
        globalFilterValue: globalFilter
      }
    }
  })

  return (
    <FormGroup className='input-group input-group-sm'>
      <SearchBar
        onChange={e => {
          const searchText = e.target.value || undefined
          setGlobalFilter(searchText)
        }}
        value={globalFilterValue}
      />
      <SearchClearButton isGlobalFilter={isGlobalFilter} onClick={() => setGlobalFilter('')} />
    </FormGroup>
  )
}

export default GlobalFilter
