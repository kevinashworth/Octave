import { Components, getFragment, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import includes from 'lodash/includes'
import PastProjects from '../../modules/past-projects/collection.js'
import withSettings from '../../modules/hocs/withSettings.js'
import { ACTIVE_PROJECT_STATUSES_ARRAY } from '../../modules/constants.js'

const PastProjectsEditForm = ({ documentId, match, history, toggle, mongoProvider }) => {
  const theDocumentId = documentId || match.params._id
  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title='Edit Past Project' />
      <Card className='card-accent-pastprojects'>
        <Card.Body>
          <Components.SmartForm
            collection={PastProjects}
            documentId={theDocumentId}
            mutationFragment={getFragment('PastProjectsEditFragment')}
            showRemove
            successCallback={document => {
              if (includes(ACTIVE_PROJECT_STATUSES_ARRAY, document.status)) {
                history.push(`/projects/${theDocumentId}/${document.slug}`)
              } else if (toggle) {
                toggle()
              } else {
                history.push(`/past-projects/${theDocumentId}/${document.slug}`)
              }
            }}
            removeSuccessCallback={document => {
              if (toggle) {
                toggle()
              } else {
                history.push('/past-projects/')
              }
            }}
            cancelCallback={document => {
              if (toggle) {
                toggle()
              } else {
                history.push(`/past-projects/${theDocumentId}/${document.slug}`)
              }
            }}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

registerComponent({
  name: 'PastProjectsEditForm',
  component: PastProjectsEditForm,
  hocs: [
    withRouter,
    withSettings
  ]
})
