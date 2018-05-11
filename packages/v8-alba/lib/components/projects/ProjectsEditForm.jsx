import { Components, getFragment, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { withRouter } from 'react-router';
import Projects from '../../modules/projects/collection.js';

class ProjectsEditForm extends React.Component {
  render () {
    const { documentId, params, router, toggle } = this.props;
    const theDocumentId = documentId ? documentId : params._id;

  return (
    <div>
      <Components.SmartForm
        collection={Projects}
        documentId={documentId ? documentId : params._id}
        mutationFragment={getFragment('ProjectsEditFragment')}
        queryFragment={getFragment('ProjectsEditFragment')}
        fields={['projectTitle',
          'projectType',
          'contactId',
            // 'personnel',
            // 'personnel.personnelId',
            // 'personnel.name',
            // 'personnel.personnelTitle',
          'status',
          'union']}
        showRemove={true}
        successCallback={document => {
          if (toggle) {
            toggle();
          } else {
            router.push(`/projects/${theDocumentId}`);
          }
        }}
      />
    </div>
    )
  }
}

registerComponent('ProjectsEditForm', ProjectsEditForm, withRouter);
