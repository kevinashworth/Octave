import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, getFragment } from "meteor/vulcan:core";
import { Button } from 'reactstrap';

import Contacts from '../../modules/contacts/collection.js';

const ContactsEditForm = ({documentId, closeModal}) =>


  <Components.Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
    <Components.ModalHeader toggle={this.toggle}>Modal title</Components.ModalHeader>
    <Components.ModalBody>
      <Components.SmartForm
        collection={Contacts}
        documentId={documentId}
        mutationFragment={getFragment('ContactsItemFragment')}
        showRemove={true}
        successCallback={document => {
          closeModal();
        }}
      />
    </Components.ModalBody>
    <Components.ModalFooter>
      <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
      <Button color="secondary" onClick={this.toggle}>Cancel</Button>
    </Components.ModalFooter>
  </Components.Modal>


registerComponent('ContactsEditForm', ContactsEditForm);
