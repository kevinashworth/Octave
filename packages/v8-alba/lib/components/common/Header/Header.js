import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
// import { NavLink } from 'react-router-dom'
import { Nav, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap'

class Header extends PureComponent {
  sidebarToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-hidden')
  }

  mobileSidebarToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-mobile-show')
  }

  // <NavItem className='px-3'>
  //             <NavLink to='/contacts/list'>List</NavLink>
  // </NavItem>

  render () {
    return (
      <header className='app-header navbar'>
        <NavbarToggler className='d-lg-none' onClick={this.mobileSidebarToggle}>
          <span className='navbar-toggler-icon' />
        </NavbarToggler>
        <NavbarBrand href='#' />
        <NavbarToggler className='d-none d-lg-inline-flex' onClick={this.sidebarToggle}>
          <span className='navbar-toggler-icon' />
        </NavbarToggler>
        <Nav className='d-none d-lg-inline-flex' navbar>
          <Components.Search />
        </Nav>
        <Nav className='ml-auto'>
          <Components.UsersMenu />
        </Nav>
      </header>
    )
  }
}

registerComponent('Header', Header)
