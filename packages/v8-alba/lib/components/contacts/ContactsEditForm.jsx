import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, getFragment } from "meteor/vulcan:core";
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Contacts from '../../modules/contacts/collection.js';

const ContactsEditForm = ({document, toggle}) =>
  <Components.SmartForm
    collection={Contacts}
    document={document}
    mutationFragment={getFragment('ContactsItemFragment')}
    showRemove={true}
    successCallback={document => {
      toggle();
    }}
  />

registerComponent('ContactsEditForm', ContactsEditForm);
