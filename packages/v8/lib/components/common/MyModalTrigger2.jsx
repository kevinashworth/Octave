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

  closeModal = () => {
    // this.props.closeCallback && this.props.closeCallback()
    this.setState({ modalIsOpen: false })
  }

  handleHide = () => this.closeModal()

  handleClick = (e) => {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick()
    }
    this.openModal()
  }

  openModal = () => {
    // this.props.openCallback && this.props.openCallback()
    this.setState({ modalIsOpen: true })
  }

  render () {
    const {
      backdrop = 'static',
      children,
      className,
      component,
      dialogClassName,
      header,
      footer,
      modalProps,
      label,
      size,
      type,
      title,
      trigger,
      variant = 'secondary'
    } = this.props

    const childrenComponent = React.cloneElement(children, { closeModal: this.closeModal })

    const footerComponent = footer
      ? React.cloneElement(footer, { closeModal: this.closeModal })
      : <Button variant='secondary' onClick={() => this.closeModal()}>Cancel</Button>
    const headerComponent = header && React.cloneElement(header, { closeModal: this.closeModal })

    let triggerComponent = trigger || component
    triggerComponent = component
      ? <span onClick={this.handleClick}>{component}</span>
      : type === 'link'
        ? <a className={className} href='#' onClick={this.handleClick}>{label}</a>
        : <Button className={className} onClick={this.handleClick} variant={variant}>{label}</Button>

    return (
      <div className='modal-trigger'>
        {triggerComponent}
        <Components.Modal
          backdrop={backdrop}
          className={className}
          dialogClassName={dialogClassName}
          header={headerComponent}
          footer={footerComponent}
          onHide={this.handleHide}
          show={this.state.modalIsOpen}
          size={size}
          title={title}
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
  onClick: PropTypes.func,
  size: PropTypes.string,
  trigger: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  type: PropTypes.oneOf(['button', 'link']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark'])
}

replaceComponent('ModalTrigger', MyModalTrigger2)

export default MyModalTrigger2
