import { Components, getFragment, registerComponent } from "meteor/vulcan:core";
import React from 'react';
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
