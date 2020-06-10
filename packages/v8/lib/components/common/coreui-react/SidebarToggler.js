import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
// import { sidebarCssClasses, validBreakpoints, checkBreakpoint } from './Shared/index';
// import toggleClasses from './Shared/toggle-classes';
import SidebarController from './Shared/my-sidebar-controller.js'

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  display: PropTypes.any,
  mobile: PropTypes.bool,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  type: PropTypes.string
}

const defaultProps = {
  display: 'lg',
  mobile: false,
  tag: 'button',
  type: 'button'
}

class AppSidebarToggler extends Component {
  constructor (props) {
    super(props)
    this.sidebarController = SidebarController
  }

  sidebarToggle (e) {
    e.preventDefault()
    // this.toggle();
    this.sidebarController.toggleOpen()
  }

  // toggle(force) {
  //   const mobile = this.props.mobile;
  //   const display = this.sidebarController.display;
  //   let cssClass = sidebarCssClasses[0]
  //   if (!mobile && display && checkBreakpoint(display, validBreakpoints)) {
  //     cssClass = `sidebar-${display}-show`
  //   }
  //   toggleClasses(cssClass, sidebarCssClasses, force)
  // }

  render () {
    const { className, children, tag: Tag, ...attributes } = this.props

    delete attributes.mobile
    delete attributes.display

    const classes = classNames(className, 'navbar-toggler')

    return (
      <Tag type='button' className={classes} {...attributes} onClick={(event) => this.sidebarToggle(event)} data-sidebar-toggler>
        {children || <span className='navbar-toggler-icon' />}
      </Tag>
    )
  }
}

AppSidebarToggler.propTypes = propTypes
AppSidebarToggler.defaultProps = defaultProps

export default AppSidebarToggler
