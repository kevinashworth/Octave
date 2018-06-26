import { Components, getFragment, registerComponent } from "meteor/vulcan:core";
import Users from 'meteor/vulcan:users';
import React, { PureComponent } from 'react';
import projectFiltersArray from '../../../modules/filters/custom_fields.js';

const ProjectFilters = () => {
  debugger;
  return (
    <div className="animated fadeIn">
    <Components.SmartForm
      collection={Users}
      fields={projectFiltersArray}
      mutationFragment={getFragment('UserProjectFilterList')}
    />
  </div>
  )
}

registerComponent('ProjectFilters', ProjectFilters);
