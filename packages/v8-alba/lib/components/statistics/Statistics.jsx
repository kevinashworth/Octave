import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { withRouter } from 'react-router';

const Statistics = ({ children, router }) => (
  <div>
    { children ? children : router.push('/statistics/list') }
  </div>
);

registerComponent('Statistics', Statistics, withRouter);
