import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, getFragment } from "meteor/vulcan:core";
import Contacts from '../../modules/contacts/collection.js';

const ContactsEditForm = ({documentId, toggle, params}) =>
  <Components.SmartForm
    collection={Contacts}
    documentId={documentId ? documentId : params._id}
    mutationFragment={getFragment('ContactsEditFragment')}
    showRemove={true}
    successCallback={document => {
      toggle();
    }}
  />

registerComponent('ContactsEditForm', ContactsEditForm);
