import React from 'react'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter }
}) => {
  const count = preFilteredRows.length
  return (
    <InputGroup size='sm'>
      <FormControl
        className='column-filter'
        onChange={e => setFilter(e.target.value || '')}
        onClick={e => e.stopPropagation()} // Otherwise triggers sortBy
        placeholder={`Filter ${count} records...`}
        value={filterValue || ''}
      />
      {filterValue &&
        <InputGroup.Append>
          <Button
            variant='danger'
            onClick={e => {
              e.stopPropagation()
              setFilter('')
            }}
          >
            <i className='far fa-times' />
          </Button>
        </InputGroup.Append>}
    </InputGroup>
  )
}

export default DefaultColumnFilter
