import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, getFragment } from "meteor/vulcan:core";
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Contacts from '../../modules/contacts/collection.js';

const ContactsEditForm = ({documentId, toggle}) =>
  <Components.SmartForm
    collection={Contacts}
    documentId={documentId}
    mutationFragment={getFragment('ContactsDetailsFragment')}
    showRemove={true}
    successCallback={document => {
      toggle();
    }}
  />

registerComponent('ContactsEditForm', ContactsEditForm);
