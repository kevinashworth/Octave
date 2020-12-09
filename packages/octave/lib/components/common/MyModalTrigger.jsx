import { Components, replaceComponent } from 'meteor/vulcan:core'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const MyModalTrigger = (props) => {
  const {
    backdrop = 'static',
    children,
    className,
    component,
    dialogClassName,
    header,
    footer,
    keyboard = false,
    label,
    modalProps,
    onClick,
    size,
    type,
    title,
    trigger,
    variant = 'secondary'
  } = props
  const [show, setShow] = useState(false)

  const closeModal = () => {
    setShow(false)
  }

  const handleHide = () => closeModal()

  const handleClick = (e) => {
    e.preventDefault()
    if (onClick) {
      onClick()
    }
    openModal()
  }

  const openModal = () => {
    setShow(true)
  }

  const childrenComponent = React.cloneElement(children, { closeModal: closeModal })

  const footerComponent = footer
    ? React.cloneElement(footer, { closeModal: closeModal })
    : <Button variant='secondary' onClick={() => closeModal()}>Cancel</Button>

  const headerComponent = header && React.cloneElement(header, { closeModal: closeModal })

  let triggerComponent = trigger || component
  triggerComponent = component
    ? <span onClick={handleClick}>{component}</span>
    : type === 'link'
      ? <a className={className} href='#' onClick={handleClick}>{label}</a>
      : <Button className={className} onClick={handleClick} variant={variant}>{label}</Button>

  return (
    <div className='modal-trigger'>
      {triggerComponent}
      <Components.Modal
        backdrop={backdrop}
        className={className}
        dialogClassName={dialogClassName}
        header={headerComponent}
        footer={footerComponent}
        keyboard={keyboard}
        onHide={handleHide}
        show={show}
        size={size}
        title={title}
        {...modalProps}
      >
        {childrenComponent}
      </Components.Modal>
    </div>
  )
}

MyModalTrigger.propTypes = {
  className: PropTypes.string,
  component: PropTypes.object, // keep for backwards compatibility
  footer: PropTypes.object,
  keyboard: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClick: PropTypes.func,
  size: PropTypes.string,
  trigger: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  type: PropTypes.oneOf(['button', 'link']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark'])
}

replaceComponent('ModalTrigger', MyModalTrigger)
