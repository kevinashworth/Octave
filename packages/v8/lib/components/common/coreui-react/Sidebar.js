import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import ClickOutHandler from 'react-onclickout'
import './Shared/element-closest'
import SidebarController from './Shared/my-sidebar-controller.js'

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  compact: PropTypes.bool,
  display: PropTypes.string,
  fixed: PropTypes.bool,
  minimized: PropTypes.bool,
  isOpen: PropTypes.bool,
  offCanvas: PropTypes.bool,
  staticContext: PropTypes.any,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
}

const defaultProps = {
  tag: 'div',
  compact: false,
  display: '',
  fixed: false,
  minimized: false,
  isOpen: false,
  offCanvas: false
}

class AppSidebar extends Component {
  constructor (props) {
    super(props)
    this.sidebarController = SidebarController
    this.isCompact = this.isCompact.bind(this)
    this.isFixed = this.isFixed.bind(this)
    this.isOffCanvas = this.isOffCanvas.bind(this)
  }

  componentDidMount () {
    this.displayBreakpoint(this.props.display)
    this.isCompact(this.props.compact)
    this.isFixed(this.props.fixed)
    this.isOffCanvas(this.props.offCanvas)
    this.handleSidebarMinimizer(this.props.minimized)
    if (this.sidebarController.isOnMobile()) {
      this.sidebarController.close()
    }
  }

  handleSidebarMinimizer = (shouldMinimize) => {
    if (shouldMinimize) {
      this.sidebarController.narrow()
    } else {
      this.sidebarController.wide()
    }
  }

  isCompact (compact) {
    if (compact) { document.body.classList.add('sidebar-compact') }
  }

  isFixed (fixed) {
    if (fixed) { document.body.classList.add('sidebar-fixed') }
  }

  isOffCanvas (offCanvas) {
    if (offCanvas) { document.body.classList.add('sidebar-off-canvas') }
  }

  displayBreakpoint (display) {
    this.sidebarController.setDisplayBreakpoint(display)
  }

  hideMobile = () => {
    this.sidebarController.hideMobile()
  }

  handleClickOut = (e) => {
    if (typeof window !== 'undefined' && (document.body.classList.contains('sidebar-show') || document.body.classList.contains('sidebar-lg-show'))) {
      if (!e.target.closest('[data-sidebar-toggler]')) {
        this.hideMobile()
      }
    }
  }

  render () {
    const { className, children, tag: Tag, ...attributes } = this.props

    delete attributes.compact
    delete attributes.display
    delete attributes.fixed
    delete attributes.minimized
    delete attributes.offCanvas
    delete attributes.isOpen
    delete attributes.staticContext

    const classes = classNames(className, 'sidebar')

    // sidebar-nav root
    return (
      <ClickOutHandler onClickOut={this.handleClickOut}>
        <Tag className={classes} {...attributes}>
          {children}
        </Tag>
      </ClickOutHandler>
    )
  }
}

AppSidebar.propTypes = propTypes
AppSidebar.defaultProps = defaultProps

export default AppSidebar
