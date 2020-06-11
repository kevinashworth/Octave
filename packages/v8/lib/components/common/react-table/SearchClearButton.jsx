import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const btnColor = (isGlobalFilter) => {
  if (isGlobalFilter) {
    return 'danger'
  }
  return 'secondary'
}

const SearchClearButton = ({
  isGlobalFilter,
  onClick
}) => (
  <span className='input-group-btn'>
    <Button size='sm' variant={btnColor(isGlobalFilter)} onClick={onClick}>Clear</Button>
  </span>
)

SearchClearButton.propTypes = {
  isGlobalFilter: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

export default SearchClearButton
