import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Nav, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap'
import HeaderDropdown from './HeaderDropdown'

class Header extends PureComponent {
  sidebarToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-hidden')
  }

  mobileSidebarToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-mobile-show')
  }

  render () {
    return (
      <header className='app-header navbar'>
        <NavbarToggler className='d-lg-none' onClick={this.mobileSidebarToggle}>
          <span className='navbar-toggler-icon' />
        </NavbarToggler>
        <NavbarBrand href='#' />
        <NavbarToggler className='d-md-down-none' onClick={this.sidebarToggle}>
          <span className='navbar-toggler-icon' />
        </NavbarToggler>
        <Nav className='d-md-down-none' navbar>
          <NavItem className='px-3'>
            <NavLink href='/contacts/list'>List</NavLink>
          </NavItem>
          <NavItem className='px-3'>
            <NavLink href='/contacts/vlist'>V-List</NavLink>
          </NavItem>
          <NavItem className='px-3'>
            <NavLink href='/contacts/nameonly'>NameOnly</NavLink>
          </NavItem>
        </Nav>
        <Nav className='ml-auto' navbar>
          <HeaderDropdown accnt />
        </Nav>
        <Nav>
          <Components.UsersMenu />
        </Nav>
        <NavbarToggler className='d-md-down-none' onClick={this.sidebarToggle}>
          <span className='navbar-toggler-icon' />
        </NavbarToggler>
      </header>
    )
  }
}

registerComponent('Header', Header)
