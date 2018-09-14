import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { withRouter } from 'react-router';

const Projects = ({ children, router }) => (
  <div>
    { children ? children : router.push('/projects/datatable') }
  </div>
);

registerComponent('Projects', Projects, withRouter);
