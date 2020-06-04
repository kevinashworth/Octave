import React from 'react'
import PropTypes from 'prop-types'
import FormControl from 'react-bootstrap/FormControl'

const SearchBar = (props) => {
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
      placeholder={placeholder || SearchBar.defaultProps.placeholder}
      onChange={e => onChange(e)}
      value={value}
    />
  )
}

SearchBar.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  tableId: PropTypes.string,
  value: PropTypes.string
}

SearchBar.defaultProps = {
  className: '',
  placeholder: 'Search...',
  style: {},
  tableId: '0'
}

export default SearchBar
