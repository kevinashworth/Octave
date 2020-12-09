import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'
import NavItem from 'react-bootstrap/NavItem'

const AppHeaderDropdown = ({ children }) => {
  const [show, setShow] = useState(false)
  return (
    <Dropdown as={NavItem} show={show} onToggle={() => setShow(!show)}>
      {children}
    </Dropdown>
  )
}

AppHeaderDropdown.propTypes = {
  children: PropTypes.node
}

export default AppHeaderDropdown
