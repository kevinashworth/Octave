import React from 'react'
import PropTypes from 'prop-types'
// import { Input } from 'reactstrap'
import FormControl from 'react-bootstrap/FormControl'

function MySearchBar (props) {
  const {
    className,
    onChange,
    placeholder,
    style,
    tableId,
    value
  } = props

  return (
    <FormControl
      id={`search-bar-${tableId}`}
      type='text'
      style={style}
      className={className}
      aria-label='Enter search text'
      placeholder={placeholder || MySearchBar.defaultProps.placeholder}
      onChange={onChange}
      value={value}
    />
  )
}

MySearchBar.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  tableId: PropTypes.string,
  value: PropTypes.string
}

MySearchBar.defaultProps = {
  className: '',
  placeholder: 'Search...',
  style: {},
  tableId: '0'
}

export default MySearchBar
