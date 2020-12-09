import { Components, getSetting } from 'meteor/vulcan:core'
import React from 'react'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'
import NavLink from 'react-bootstrap/NavLink'
import withSettings from '../../../modules/hocs/withSettings.js'

import { AppNavbarBrand, AppSidebarToggler } from '../coreui-react'

const DefaultHeader = withSettings((props) => {
  const { mongoProvider, showMongo } = props
  return (
    <>
      <AppSidebarToggler className='d-lg-none' display='md' mobile />
      <AppNavbarBrand
        full={{ src: '/img/Octave.png', width: 64, height: 32, alt: 'Horiz' }}
        minimized={{ src: '/img/8.png', width: 32, height: 32, alt: 'Square' }}
        href={getSetting('homeUrl')}
      />
      <AppSidebarToggler className='d-md-down-none' display='lg' />
      {showMongo
        ? <Button variant={mongoProvider.indexOf('Atlas') > -1 ? 'outline-success' : 'outline-danger'}>mongo: {mongoProvider}</Button>
        : null}
      <Nav className='ml-auto'>
        <Dropdown as={NavItem} drop='left'>
          <Dropdown.Toggle as={NavLink} id='dropdown-users-menu'>
            <i className='fad fa-user-circle fa-2x' />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Components.UsersMenu />
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </>
  )
})

export default DefaultHeader
