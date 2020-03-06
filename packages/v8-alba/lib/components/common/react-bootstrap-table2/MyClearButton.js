import React from 'react'
import PropTypes from 'prop-types'

const MyClearButton = ({
  onClear,
  text,
  className
}) => (
  <span className='input-group-btn'>
    <button className={ `btn btn-sm ${className}` } onClick={ onClear }>{ text }</button>
  </span>
)

MyClearButton.propTypes = {
  onClear: PropTypes.func.isRequired,
  className: PropTypes.string,
  text: PropTypes.string
}

MyClearButton.defaultProps = {
  text: 'Clear',
  className: 'btn-secondary'
}

export default MyClearButton
