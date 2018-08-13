import { extendFragment } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import { PROJECT_ENUM } from '../constants.js';

const addFields = () => {
  // eslint-disable-next-line no-console
  console.log('adding PROJECT_ENUM:', PROJECT_ENUM);
  Users.addField([
    {
      fieldName: 'projectTypeFilters',
      fieldSchema: {
        type: Array,
        optional: true,
        defaultValue: PROJECT_ENUM,
        viewableBy: ['members'],
        insertableBy: ['members'],
        editableBy: ['members'],
      }
    },
    {
      fieldName: 'projectTypeFilters.$',
      fieldSchema: {
        type: String,
        optional: true
      }
    }
  ]);

  extendFragment(
    'UsersCurrent',`
    projectTypeFilters
  `);
};

addFields();
