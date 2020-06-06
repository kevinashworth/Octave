import { replaceComponent } from 'meteor/vulcan:lib'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const MyModalTrigger = (props) => {
  const { children, className, component, dialogClassName, label, size, title, trigger, type } = props
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const renderHeader = () => {
    return (
      <Modal.Header closeButton>
        {title}
      </Modal.Header>
    )
  }

  const C = component || trigger
  const triggerComponent = C
    ? <span onClick={handleShow} className={className}>{C}</span>
    : type === 'link'
      ? <a className={className} href='#' onClick={handleShow}>{label}</a>
      : <Button className={className} onClick={handleShow} variant='secondary'>{label}</Button>

  const childrenComponent = React.cloneElement(children, { toggle: this.toggle })

  return (
    <div className='modal-trigger'>
      {triggerComponent}
      <Modal
        className={className}
        show={show}
        size={size}
        onHide={handleClose}
        dialogClassName={dialogClassName}
      >
        {title ? renderHeader() : null}
        <Modal.Body>
          {childrenComponent}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

MyModalTrigger.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.object,
  dialogClassName: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  trigger: PropTypes.object,
  type: PropTypes.oneOf(['link', 'button'])
}

MyModalTrigger.defaultProps = {
  size: 'large'
}

replaceComponent('ModalTrigger', MyModalTrigger)
