import { Components, getFragment, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { withRouter } from 'react-router';
import Projects from '../../modules/projects/collection.js';

const ProjectsEditForm = ({documentId, toggle, params, router}) =>
  <Components.SmartForm
    collection={Projects}
    documentId={documentId ? documentId : params._id}
    mutationFragment={getFragment('ProjectsEditFragment')}
    queryFragment={getFragment('ProjectsEditFragment')}
    fields={['projectTitle',
      'projectType',
      'contactId',
      'status',
      'union']}
    showRemove={true}
    successCallback={document => {
      if (toggle) {
        toggle();
      } else {
        router.push(`/projects/${documentId ? documentId : params._id}`);
      }
    }}
  />

registerComponent('ProjectsEditForm', ProjectsEditForm, withRouter);
