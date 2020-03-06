// See https://github.com/react-bootstrap-table/react-bootstrap-table2/blob/master/packages/react-bootstrap-table2-toolkit/src/search/MySearchBar.js
// See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component
import React from 'react'
import PropTypes from 'prop-types'

function MySearchBar(props) {
  const {
    className,
    placeholder,
    style,
    tableId
  } = props

  return (
    <input
      id={ `search-bar-${tableId}` }
      type='text'
      style={ style }
      className={ `form-control ${className}` }
      aria-label='Enter search text'
      placeholder={ placeholder || MySearchBar.defaultProps.placeholder }
      onChange={ props.handleChange }
      value={ props.searchText }
    />
  )
}

MySearchBar.propTypes = {
  handleChange: PropTypes.func.isRequired,
  searchText: PropTypes.string,
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
