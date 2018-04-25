import { Components, getFragment, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import Contacts from '../../modules/contacts/collection.js';

const ContactsNewForm = ({currentUser}) =>
  <div>
    {Contacts.options.mutations.new.check(currentUser) ?
      <div style={ { marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ccc' } }>
        <h4>Insert New Document</h4>
        <Components.SmartForm
          collection={Contacts}
          mutationFragment={getFragment('ContactsItemFragment')}
        />
      </div> :
      null
    }
  </div>

registerComponent('ContactsNewForm', ContactsNewForm, withCurrentUser);
