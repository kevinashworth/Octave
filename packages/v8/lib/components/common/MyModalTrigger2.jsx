import { Components, replaceComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

class MyModalTrigger2 extends PureComponent {
  constructor () {
    super()
    this.state = {
      modalIsOpen: false
    }
  }

  handleClick = (e) => {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick()
    }
    this.openModal()
  }

  openModal = () => {
    this.props.openCallback && this.props.openCallback()
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.props.closeCallback && this.props.closeCallback()
    this.setState({ modalIsOpen: false })
  }

  handleHide = () => this.closeModal()

  render () {
    const {
      trigger,
      component,
      children,
      label,
      size,
      className,
      dialogClassName,
      title,
      modalProps,
      header,
      footer
    } = this.props

    let triggerComponent = trigger || component
    triggerComponent = triggerComponent ? (
      <span onClick={this.handleClick}>{triggerComponent}</span>
    ) : (
      <a href='javascript:void(0)' onClick={this.handleClick}>
        {label}
      </a>
    )
    const childrenComponent = React.cloneElement(children, { closeModal: this.closeModal })
    const headerComponent = header && React.cloneElement(header, { closeModal: this.closeModal })
    const footerComponent = footer
      ? React.cloneElement(footer, { closeModal: this.closeModal })
      : <Button variant='secondary' onClick={() => this.closeModal()}>Cancel</Button>

    return (
      <div className='modal-trigger'>
        {triggerComponent}
        <Components.Modal
          size={size}
          className={className}
          show={this.state.modalIsOpen}
          onHide={this.handleHide}
          dialogClassName={dialogClassName}
          title={title}
          header={headerComponent}
          footer={footerComponent}
          {...modalProps}
        >
          {childrenComponent}
        </Components.Modal>
      </div>
    )
  }
}

MyModalTrigger2.propTypes = {
  className: PropTypes.string,
  component: PropTypes.object, // keep for backwards compatibility
  footer: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  trigger: PropTypes.object,
  size: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClick: PropTypes.func
}

replaceComponent('ModalTrigger', MyModalTrigger2)

export default MyModalTrigger2
