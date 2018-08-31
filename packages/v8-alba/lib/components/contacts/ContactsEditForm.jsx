import { Components, getFragment, registerComponent } from "meteor/vulcan:core";
import React from 'react';
import { withRouter } from 'react-router';
import Contacts from '../../modules/contacts/collection.js';

const ContactsEditForm = ({documentId, params, router, toggle}) => {
  const theDocumentId = documentId ? documentId : params._id;
  return (
    <div className="animated fadeIn">
    <Components.SmartForm
      collection={Contacts}
      documentId={theDocumentId}
      mutationFragment={getFragment('ContactsEditFragment')}
      showRemove={true}
      successCallback={document => {
        if (toggle) {
          toggle();
        } else {
          router.push(`/contacts/${theDocumentId}/${document.slug}`);
        }
      }}
      removeSuccessCallback={document => {
        if (toggle) {
          toggle();
        } else {
          router.push('/contacts/');
        }
      }}
      cancelCallback={document => {
        if (toggle) {
          toggle();
        } else {
          router.push(`/contacts/${theDocumentId}/${document.slug}`);
        }
      }}
    />
  </div>
  )
}

registerComponent('ContactsEditForm', ContactsEditForm, withRouter);
