/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import { Components } from 'meteor/vulcan:core'
import React, { lazy, Suspense, useState } from 'react'
import { NavLink } from 'react-router-dom'
// import Loadable from 'react-loadable'
import Badge from 'react-bootstrap/Badge'
import Nav from 'react-bootstrap/Nav'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import SidebarController from './Shared/my-sidebar-controller'

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  navConfig: PropTypes.any,
  navFunc: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  isOpen: PropTypes.bool,
  staticContext: PropTypes.any,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
}

const defaultProps = {
  tag: 'nav',
  navConfig: {
    items: [
      {
        name: 'Latest Updates',
        url: '/latest',
        icon: 'fad fa-megaphone',
        badge: { variant: 'info', text: 'NEW' }
      }]
  },
  isOpen: false
}

const Prefetch = lazy(() => import('../../common/Prefetch'))
const PrefetchLazy = (props) => {
  return (
    <Suspense fallback={<Components.Loading />}>
      <Prefetch {...props} />
    </Suspense>
  )
}

const AppSidebarNav = (props) => {
  const [showPrefetch, setShowPrefetch] = useState(false)
  const { className, children, navConfig, ...attributes } = props
  delete attributes.currentUserRefetch
  delete attributes.isOpen
  delete attributes.staticContext
  delete attributes.Tag

  const handleClick = (e) => {
    e.preventDefault()
    e.currentTarget.parentElement.classList.toggle('open')
  }

  const activeRoute = (routeName, props) => {
    return props.location.pathname.indexOf(routeName) > -1
      ? 'nav-item nav-dropdown open'
      : 'nav-item nav-dropdown'
  }

  const handleNavLinkClick = () => {
    SidebarController.hideMobile()
  }

  // nav list
  const navList = (items) => {
    return items.map((item, index) => navType(item, index))
  }

  // nav type
  const navType = (item, idx) => {
    return (
      item.title
        ? navTitle(item, idx)
        : item.divider
          ? navDivider(item, idx)
          : item.children
            ? navDropdown(item, idx)
            : navItem(item, idx)
    )
  }

  // nav list section title
  const navTitle = (title, key) => {
    const classes = classNames('nav-title', title.class)
    return <li key={key} className={classes}>{navWrapper(title)} </li>
  }

  // simple wrapper for nav-title item
  const navWrapper = (item) => {
    return item.wrapper && item.wrapper.element ? React.createElement(item.wrapper.element, item.wrapper.attributes, item.name) : item.name
  }

  // nav list divider
  const navDivider = (divider, key) => {
    const classes = classNames('nav-divider', divider.class)
    return <li key={key} className={classes} />
  }

  // nav dropdown
  const navDropdown = (item, key) => {
    const classIcon = classNames('nav-icon', item.icon)
    const attributes = JSON.parse(JSON.stringify(item.attributes || {}))
    const classes = classNames('nav-link', 'nav-dropdown-toggle', item.class, attributes.class)
    delete attributes.class
    return (
      <li key={key} className={activeRoute(item.url, props)}>
        <a className={classes} href='#' onClick={handleClick} {...attributes}><i className={classIcon} />
          {item.name}{navBadge(item.badge)}
        </a>
        <ul className='nav-dropdown-items'>
          {navList(item.children)}
        </ul>
      </li>
    )
  }

  // nav item with nav link
  const navItem = (item, key) => {
    const classes = {
      item: classNames(item.class),
      link: classNames('nav-link', item.variant ? `nav-link-${item.variant}` : ''),
      icon: classNames('nav-icon', item.icon)
    }
    return (
      navLink(item, key, classes)
    )
  }

  // nav link
  const navLink = (item, key, classes) => {
    const url = item.url || ''
    const itemIcon = <i className={classes.icon} />
    const itemBadge = navBadge(item.badge)
    const attributes = item.attributes || {}
    const prefetch = item.prefetch || false
    if (prefetch) {
      attributes.onMouseOver = () => {
        setShowPrefetch(true)
      }
    }

    return (
      <Nav.Item key={key} className={classes.item}>
        {attributes.disabled
          ? <Nav.Link href='' className={classes.link} {...attributes}>
            {itemIcon}{item.name}{itemBadge}
            </Nav.Link>
          : isExternal(url)
            ? <Nav.Link href={url} className={classes.link} active {...attributes}>
              {itemIcon}{item.name}{itemBadge}
              </Nav.Link>
            : <NavLink to={url} exact className={classes.link} activeClassName='active' onClick={handleNavLinkClick} {...attributes}>
              {itemIcon}{item.name}{itemBadge}
              </NavLink>}
      </Nav.Item>
    )
  }

  // badge addon to NavItem
  const navBadge = (badge) => {
    if (badge) {
      const classes = classNames(badge.class)
      return (
        <Badge className={classes} variant={badge.variant}>{badge.text}</Badge>
      )
    }
    return null
  }

  const isExternal = (url) => {
    const link = url ? url.substring(0, 4) : ''
    return link === 'http'
  }

  const navClasses = classNames(className, 'sidebar-nav')

  // ToDo: find better rtl fix
  const isRtl = window.getComputedStyle(document.documentElement).direction === 'rtl'

  // sidebar-nav root
  return (
    <PerfectScrollbar className={navClasses} {...attributes} options={{ suppressScrollX: !isRtl }}>
      <Nav>
        {children || navList(navConfig.items)}
      </Nav>
      {showPrefetch && <PrefetchLazy />}
    </PerfectScrollbar>
  )
}

AppSidebarNav.propTypes = propTypes
AppSidebarNav.defaultProps = defaultProps

export default AppSidebarNav
