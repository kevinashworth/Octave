import { Components } from 'meteor/vulcan:core'
import React, { Component } from 'react'
// import { Dropdown, DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'
import NavLink from 'react-bootstrap/NavLink'
import PropTypes from 'prop-types'

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react'

const propTypes = {
  children: PropTypes.node
}

const defaultProps = {}

class DefaultHeader extends Component {
  render () {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <>
        <AppSidebarToggler className='d-lg-none' display='md' mobile />
        <AppNavbarBrand
          full={{ src: '/img/V8.png', width: 60, height: 30, alt: 'Horiz' }}
          minimized={{ src: '/favicon/favicon-32x32.png', width: 32, height: 32, alt: 'Square' }}
        />
        <AppSidebarToggler className='d-md-down-none' display='lg' />
        <Nav className='ml-auto' navbar>
          <Dropdown as={NavItem}>
            <Dropdown.Toggle as={NavLink}>
              <i className='icon-user font-2xl' />
            </Dropdown.Toggle>
            <Dropdown.Menu right>
              <Components.UsersMenu />
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" />
        <AppAsideToggler className="d-lg-none" mobile /> */}
      </>
    )
  }
}

DefaultHeader.propTypes = propTypes
DefaultHeader.defaultProps = defaultProps

export default DefaultHeader
