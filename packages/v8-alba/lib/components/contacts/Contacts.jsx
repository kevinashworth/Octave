import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { withRouter } from 'react-router';

const Contacts = ({ children, router }) => (
  <div>
    { children ? children : router.push('/contacts/table') }
  </div>
);

registerComponent('Contacts', Contacts, withRouter);
