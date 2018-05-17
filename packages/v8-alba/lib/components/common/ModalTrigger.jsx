import { registerComponent, Components } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class MyModalTrigger extends PureComponent {

  constructor() {
    super();
    this.state = {
      modalIsOpen: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    });
  }

  renderHeader() {
    return (
      <ModalHeader toggle={this.toggle}>
        {this.props.title}
      </ModalHeader>
    )
  }

  render() {

    const triggerComponent = this.props.component ? React.cloneElement(this.props.component, { onClick: this.toggle }) : <a href="#" onClick={this.toggle}>{this.props.label}</a>;
    const childrenComponent = React.cloneElement(this.props.children, {toggle: this.toggle});

    return (
      <div className="modal-trigger">
        {triggerComponent}
        <Modal
          className={this.props.className}
          size={this.props.size}
          isOpen={this.state.modalIsOpen}
          toggle={this.toggle}
          wrapClassName={this.props.dialogClassName}
        >
          {this.props.title ? this.renderHeader() : null}
          <ModalBody>
            {childrenComponent}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

MyModalTrigger.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  component: PropTypes.object,
  size: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

MyModalTrigger.defaultProps = {
  size: 'large'
}

registerComponent('MyModalTrigger', MyModalTrigger);
