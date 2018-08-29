import { Components, getFragment, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import Projects from '../../modules/projects/collection.js';

const ProjectsNewForm = ({currentUser}) =>
  <div className="animated fadeIn">
    {Projects.options.mutations.new.check(currentUser) ?
      <div style={ { marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ccc' } }>
        <h4>Insert New Document</h4>
        <Components.SmartForm
          collection={Projects}
          mutationFragment={getFragment('ProjectsItemFragment')}
        />
      </div> :
      null
    }
  </div>

registerComponent('ProjectsNewForm', ProjectsNewForm, withCurrentUser);
