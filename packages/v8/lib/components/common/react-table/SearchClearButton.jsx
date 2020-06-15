import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const btnColor = (globalFilter) => {
  if (globalFilter) {
    return 'danger'
  }
  return 'secondary'
}

const SearchClearButton = ({
  globalFilter,
  onClick
}) => (
  <span className='input-group-btn'>
    <Button size='sm' variant={btnColor(globalFilter)} onClick={onClick}>Clear</Button>
  </span>
)

SearchClearButton.propTypes = {
  globalFilter: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default SearchClearButton
