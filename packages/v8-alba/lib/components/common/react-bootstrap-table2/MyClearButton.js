import React from 'react'
import PropTypes from 'prop-types'

const btnColor = (txt) => {
  if (!txt) {
    return 'btn-secondary'
  }
  return 'btn-danger'
}

const MyClearButton = ({
  onClear,
  searchText
}) => (
  <span className='input-group-btn'>
    <button className={ `btn btn-sm ${btnColor(searchText)}` } onClick={ onClear }>Clear</button>
  </span>
)

MyClearButton.propTypes = {
  onClear: PropTypes.func.isRequired,
  searchText: PropTypes.string
}

export default MyClearButton
