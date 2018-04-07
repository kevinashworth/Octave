import { registerComponent, Components } from 'meteor/vulcan:core';
import React, {Component} from 'react';
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody} from 'reactstrap';


class Modals extends Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     modal: false
  //   };
  //
  //   this.toggle = this.toggle.bind(this);
  // }
  //
  // toggle() {
  //   this.setState({
  //     modal: !this.state.modal
  //   });
  // }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> ModalTrigger
              </CardHeader>
              <CardBody>
                <Components.MyModalTrigger title="This is the title" component={<Button>Launch modal with a Button</Button>}>
                  <Components.ContactsEditForm/>
                </Components.MyModalTrigger>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

registerComponent('Modals', Modals);



// <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
//   <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
//   <ModalBody>
//     Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
//     et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
//     aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
//     cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
//     culpa qui officia deserunt mollit anim id est laborum.
//   </ModalBody>
//   <ModalFooter>
//     <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
//     <Button color="secondary" onClick={this.toggle}>Cancel</Button>
//   </ModalFooter>
// </Modal>
