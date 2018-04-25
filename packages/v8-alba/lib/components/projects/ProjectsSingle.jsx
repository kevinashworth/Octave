import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const ProjectsSingle = (props, context) => {
  return <Components.ProjectsDetail documentId={props.params._id} slug={props.params.slug} />
};

ProjectsSingle.displayName = "ProjectsSingle";

registerComponent('ProjectsSingle', ProjectsSingle);
