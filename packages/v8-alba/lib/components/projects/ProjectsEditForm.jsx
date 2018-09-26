import { Components, getFragment, registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router'
import Projects from '../../modules/projects/collection.js'

class ProjectsEditForm extends PureComponent {
  render () {
    const { documentId, params, router, toggle } = this.props
    const theDocumentId = documentId || params._id

    return (
      <div>
        <Components.SmartForm
          collection={Projects}
          documentId={documentId || params._id}
          mutationFragment={getFragment('ProjectsEditFragment')}
          queryFragmentName={'ProjectsEditFragment'}
          // hideFields={['personnel']}
          // fields={['projectTitle',
          //   'projectType',
          //   'contactId',
          //   'addresses',
          //   'addresses.$.street1',
          //   'addresses: { street2 }',
          //   'addresses.city',
          //   'status',
          //   'union']}
          showRemove
          successCallback={document => {
            if (toggle) {
              toggle()
            } else {
              router.push(`/projects/${theDocumentId}`)
            }
          }}
        />
      </div>
    )
  }
}

registerComponent('ProjectsEditForm', ProjectsEditForm, withRouter)
