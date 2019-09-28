import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { Component, Fragment } from 'react'
import { withRouter, NavLink } from 'react-router-dom'
import Media from 'react-media'
import { Badge, Nav, NavItem, NavLink as RsNavLink } from 'reactstrap'
import classNames from 'classnames'
import { logger } from '../../../modules/logger.js'
import nav from './_nav'

class Sidebar extends Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.activeRoute = this.activeRoute.bind(this)
    this.hideMobile = this.hideMobile.bind(this)
  }

  handleClick (e) {
    e.preventDefault()
    e.target.parentElement.classList.toggle('open')
  }

  activeRoute (routeName, props) {
    return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown'
  }

  hideMobile () {
    if (document.body.classList.contains('sidebar-mobile-show')) {
      document.body.classList.toggle('sidebar-mobile-show')
    }
  }

  render () {
    const props = this.props

    // badge addon to NavItem
    const badge = (badge) => {
      if (badge) {
        const classes = classNames(badge.class)
        return (<Badge className={classes} color={badge.variant}>{ badge.text }</Badge>)
      }
    }

    // simple wrapper for nav-title item
    // const wrapper = item => { return (item.wrapper && item.wrapper.element ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)) : item.name) }

    // nav list section title
    const title = (title) => {
      const classes = classNames('nav-title', title.class)
      const result = (<li key={title.id} className={classes}>{title.name}</li>)
      // logger.groupCollapsed('title result:')
      // logger.info(result)
      // logger.groupEnd()
      return result
    }

    // nav list divider
    const divider = (divider) => {
      const classes = classNames('divider', divider.class)
      return (<li key={divider.id} className={classes} />)
    }

    // nav label with nav link
    const navLabel = (item) => {
      const classes = {
        item: classNames('hidden-cn', item.class),
        link: classNames('nav-label', item.class ? item.class : ''),
        icon: classNames(
          !item.icon ? 'fa fa-circle' : item.icon,
          item.label.variant ? `text-${item.label.variant}` : '',
          item.label.class ? item.label.class : ''
        )
      }
      return (
        navLink(item, classes)
      )
    }

    // nav item with nav link
    const navItem = (item) => {
      const classes = {
        item: classNames(item.class),
        link: classNames('nav-link', item.variant ? `nav-link-${item.variant}` : ''),
        icon: classNames(item.icon)
      }
      return (
        navLink(item, classes)
      )
    }

    // nav link
    const navLink = (item, classes) => {
      const url = item.url ? item.url : ''
      const result = (
        <NavItem key={item.id} className={classes.item}>
          { isExternal(url)
            ? <RsNavLink href={url} className={classes.link} active>
              <i className={classes.icon} />{item.name}{badge(item.badge)}
            </RsNavLink>
            : <NavLink to={url} className={classes.link} activeClassName='active' onClick={this.hideMobile}>
              <i className={classes.icon} />{item.name}{badge(item.badge)}
            </NavLink>
          }
        </NavItem>
      )
      // logger.groupCollapsed('navLink result:')
      // logger.info(result)
      // logger.groupEnd()
      return result
    }

    // nav dropdown
    const navDropdown = (item) => {
      return (
        <li key={item.id} className={this.activeRoute(item.url, props)}>
          <a className='nav-link nav-dropdown-toggle' href='#' onClick={this.handleClick}><i className={item.icon} />{item.name}</a>
          <ul className='nav-dropdown-items'>
            {navList(item.children)}
          </ul>
        </li>
      )
    }

    // nav type
    const navType = (item) => {
      if (!item) {
        return null
      }
      if (item.title) {
        return title(item)
      } else if (item.divider) {
        return divider(item)
      } else if (item.label) {
        return navLabel(item)
      } else if (item.children) {
        return navDropdown(item)
      } else {
        return navItem(item)
      }
    }

    // nav list
    const navList = (items) => {
      return items.map((item) => navType(item))
    }

    const isExternal = (url) => {
      const link = url ? url.substring(0, 4) : ''
      return link === 'http'
    }

    // const topNav = navList(nav.items)
    // const xsNav = navList(nav.xsItems)
    // const smNav = navList(nav.smItems)
    // const bottomNav = Users.isAdmin(props.currentUser) ? navList(nav.adminItems) : null

    // sidebar-nav root
    // KSA - see https://getbootstrap.com/docs/4.1/layout/overview/ for xs & sm
    return (
      <div className='sidebar'>
        <Components.SidebarHeader />
        <Components.SidebarForm />
        <nav className='sidebar-nav'>
          <Nav>
            <Media query="(max-width: 575.98px)" render={() => {
              const topItems = nav.items
              const midItems = nav.xsItems
              const btmItems = Users.isAdmin(props.currentUser) ? nav.adminItems : null
              const allItems = topItems.concat(midItems, btmItems)
              logger.groupCollapsed('allItems (xs):')
              logger.info(allItems)
              logger.groupEnd()
              return (
                <Fragment>
                  {navList(allItems)}
                </Fragment>
              )}} />
            <Media query="(min-width: 575.98px)" render={() => {
              const topItems = nav.items
              const midItems = nav.smItems
              const btmItems = Users.isAdmin(props.currentUser) ? nav.adminItems : null
              const allItems = topItems.concat(midItems, btmItems)
              logger.groupCollapsed('allItems (sm):')
              logger.info(allItems)
              logger.groupEnd()
              return (
                <Fragment>
                  {navList(allItems)}
                </Fragment>
              )}} />
          </Nav>
        </nav>
        <Components.SidebarFooter />
        <Components.SidebarMinimizer />
      </div>
    )
  }
}

registerComponent('Sidebar', Sidebar, withCurrentUser, withRouter)
