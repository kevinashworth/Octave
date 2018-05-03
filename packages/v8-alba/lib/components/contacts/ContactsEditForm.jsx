import { Components, getFragment, registerComponent  } from "meteor/vulcan:core";
import React from 'react';
import { withRouter } from 'react-router';
import Contacts from '../../modules/contacts/collection.js';

const ContactsEditForm = ({documentId, toggle, params}) =>
  <Components.SmartForm
    collection={Contacts}
    documentId={documentId ? documentId : params._id}
    mutationFragment={getFragment('ContactsEditFragment')}
    showRemove={true}
    successCallback={document => {
      // toggle();
      this.props.router.push('/');
    }}

    // successCallback={post => {
    //   this.props.closeModal();
    //   this.props.flash(this.context.intl.formatMessage({ id: 'posts.edit_success' }, { title: post.title }), 'success');
    // }}
    // removeSuccessCallback={({ documentId, documentTitle }) => {
    //   // post edit form is being included from a single post, redirect to index
    //   // note: this.props.params is in the worst case an empty obj (from react-router)
    //   if (this.props.params._id) {
    //     this.props.router.push('/');
    //   }
    //
    //   const deleteDocumentSuccess = this.context.intl.formatMessage({ id: 'posts.delete_success' }, { title: documentTitle });
    //   this.props.flash(deleteDocumentSuccess, 'success');
    //   // todo: handle events in collection callbacks
    //   // this.context.events.track("post deleted", {_id: documentId});
    // }}

  />

registerComponent('ContactsEditForm', ContactsEditForm, withRouter);
