import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Input, Nav, NavbarBrand, NavbarToggler } from 'reactstrap'

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
        <NavbarToggler className='d-none d-lg-inline-flex' onClick={this.sidebarToggle}>
          <span className='navbar-toggler-icon' />
        </NavbarToggler>
        <Nav navbar>
          <Input placeholder='Algolia' />
        </Nav>
        <Nav className='ml-auto'>
          <Components.UsersMenu />
        </Nav>
      </header>
    )
  }
}

registerComponent('Header', Header)
