import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, getFragment } from "meteor/vulcan:core";
import Projects from '../../modules/projects/collection.js';

const ProjectsEditForm = ({documentId, toggle, params}) =>
  <Components.SmartForm
    collection={Projects}
    documentId={documentId ? documentId : params._id}
    mutationFragment={getFragment('ProjectsEditFragment')}
    showRemove={true}
    successCallback={document => {
      toggle();
    }}
  />

registerComponent('ProjectsEditForm', ProjectsEditForm);
