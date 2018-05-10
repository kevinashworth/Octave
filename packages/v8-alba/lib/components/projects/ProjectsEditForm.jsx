import { Components, getFragment, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { withRouter } from 'react-router';
import { Card, CardBody, CardHeader } from 'reactstrap';
import Select from 'react-select';
import Projects from '../../modules/projects/collection.js';

class ProjectsEditForm extends React.Component {
  state = {
    selectedOption: '',
  }
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    // eslint-disable-next-line no-console
    console.log(`Selected: ${selectedOption.label}`);
  }

  render () {
    const { documentId, params, router, toggle } = this.props;
    const { selectedOption } = this.state;
    const theDocumentId = documentId ? documentId : params._id;

  return (
    <div>
      <Card>
        <CardHeader>
          <i className="icon-note"></i><strong>React-Select</strong>
        </CardHeader>
        <CardBody>
          <Select
            name="form-field-name"
            value={selectedOption}
            onChange={this.handleChange}
            options={[
              { value: 'one', label: 'One' },
              { value: 'two', label: 'Two' },
            ]}
          />
        </CardBody>
      </Card>
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
