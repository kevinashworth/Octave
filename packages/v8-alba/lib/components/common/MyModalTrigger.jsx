import { replaceComponent } from 'meteor/vulcan:lib'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import ModalHeader from 'react-bootstrap/ModalHeader'

const MyModalTrigger = (props) => {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const renderHeader = () => {
    return (
      <ModalHeader closeButton>
        {props.title}
      </ModalHeader>
    )
  }

  const triggerComponent = props.component
    ? React.cloneElement(props.component, { onClick: handleShow })
    : <Button variant='secondary' onClick={handleShow}>{props.label}</Button>

  const childrenComponent = React.cloneElement(props.children, { toggle: this.toggle })

  return (
    <div className='modal-trigger'>
      {triggerComponent}
      <Modal
        className={props.className}
        show={show}
        size={props.size}
        onHide={handleClose}
        dialogClassName={props.dialogClassName}
      >
        {props.title ? renderHeader() : null}
        <ModalBody>
          {childrenComponent}
        </ModalBody>
        <ModalFooter>
          <Button variant='secondary' onClick={handleClose}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

MyModalTrigger.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  component: PropTypes.object,
  size: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
}

MyModalTrigger.defaultProps = {
  size: 'large'
}

replaceComponent('ModalTrigger', MyModalTrigger)
