import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import Contacts from '../../modules/contacts/collection.js';

const CDT = () => (
  <div>
      <Components.Datatable
        collection={Contacts}
        columns={['fullName', 'title', 'street1', 'street2', 'city', 'state', 'zip']}
        options={{ fragmentName: 'ContactsSingleFragment' }}
        showEdit={false}
      />
  </div>
);

registerComponent('CDT', CDT);
