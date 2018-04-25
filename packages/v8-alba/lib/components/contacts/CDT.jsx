import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import Contacts from '../../modules/contacts/collection.js';

const CDT = () => (
  <div className="app-content">
    <div className="movies-app">
      <Components.Datatable
        collection={Contacts}
        columns={['fullName', 'zip']}
        // options={{ terms: { view: 'alphabetical' } }} // uncomment on #Step18
      />
    </div>
  </div>
);

registerComponent('CDT', CDT);
