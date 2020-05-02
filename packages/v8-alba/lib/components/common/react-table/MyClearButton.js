import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'


const btnColor = (txt) => {
  if (!txt) {
    return 'btn-secondary'
  }
  return 'btn-danger'
}

const MyClearButton = ({
  onClick,
  globalFilter
}) => (
  <span className='input-group-btn'>
    <Button className={ `btn btn-sm ${btnColor(globalFilter)}` } onClick={ onClick }>Clear</Button>
  </span>
)

MyClearButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  globalFilter: PropTypes.string
}

export default MyClearButton
