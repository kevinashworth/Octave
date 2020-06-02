import { Components } from 'meteor/vulcan:core'
import React from 'react'
// import { Dropdown, DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'
import NavLink from 'react-bootstrap/NavLink'

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react'

const DefaultHeader = () => {
  return (
    <>
      <AppSidebarToggler className='d-lg-none' display='md' mobile />
      <AppNavbarBrand
        full={{ src: '/img/V8.png', width: 60, height: 30, alt: 'Horiz' }}
        minimized={{ src: '/favicon/favicon-32x32.png', width: 32, height: 32, alt: 'Square' }}
      />
      <AppSidebarToggler className='d-md-down-none' display='lg' />
      <Nav className='ml-auto'>
        <Dropdown as={NavItem} drop='left'>
          <Dropdown.Toggle as={NavLink} id='dropdown-users-menu'>
            <i className='fa fa-user-circle-o fa-lg' />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Components.UsersMenu />
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </>
  )
}

export default DefaultHeader
