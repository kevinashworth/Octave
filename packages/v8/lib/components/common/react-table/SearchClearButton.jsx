import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const btnColor = (txt) => {
  if (!txt) {
    return 'secondary'
  }
  return 'danger'
}

const SearchClearButton = ({
  onClick,
  globalFilter
}) => (
  <span className='input-group-btn'>
    <Button size='sm' variant={btnColor(globalFilter)} onClick={onClick}>Clear</Button>
  </span>
)

SearchClearButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  globalFilter: PropTypes.string
}

export default SearchClearButton