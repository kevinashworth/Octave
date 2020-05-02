import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'reactstrap'

function MySearchBar(props) {
  const {
    className,
    placeholder,
    style,
    tableId
  } = props

  return (
    <Input
      id={ `search-bar-${tableId}` }
      type='text'
      style={ style }
      className={ `form-control ${className}` }
      aria-label='Enter search text'
      placeholder={ placeholder || MySearchBar.defaultProps.placeholder }
      onChange={ props.onChange }
      value={ props.value }
    />
  )
}

MySearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  tableId: PropTypes.string
}

MySearchBar.defaultProps = {
  className: '',
  placeholder: 'Search...',
  style: {},
  tableId: '0'
}

export default MySearchBar
