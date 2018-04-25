import { Components, getFragment, registerComponent  } from "meteor/vulcan:core";
import React from 'react';
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
