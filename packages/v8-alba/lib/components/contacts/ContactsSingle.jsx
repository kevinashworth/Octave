import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const ContactsSingle = (props, context) => {
  return <Components.ContactsProfile documentId={props.params._id} slug={props.params.slug} />
};

ContactsSingle.displayName = "ContactsSingle";

registerComponent('ContactsSingle', ContactsSingle);
