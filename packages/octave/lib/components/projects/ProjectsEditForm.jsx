import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import includes from 'lodash/includes'
import Projects from '../../modules/projects/collection.js'
import withSettings from '../../modules/hocs/withSettings.js'
import { PAST_PROJECT_STATUSES_ARRAY } from '../../modules/constants.js'

const ProjectsEditForm = ({ documentId, match, history, toggle, mongoProvider }) => {
  const theDocumentId = documentId || (match && match.params._id)
  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title='Edit Project' />
      <Card className='card-accent-projects'>
        <Card.Body>
          <Components.SmartForm
            collection={Projects}
            documentId={theDocumentId}
            showRemove
            successCallback={document => {
              if (includes(PAST_PROJECT_STATUSES_ARRAY, document.status)) {
                history.push(`/past-projects/${document._id}/${document.slug}`)
              } else if (toggle) {
                toggle()
              } else {
                history.push(`/projects/${document._id}/${document.slug}`)
              }
            }}
            removeSuccessCallback={document => {
              if (toggle) {
                toggle()
              } else {
                history.push('/projects/')
              }
            }}
            cancelCallback={document => {
              if (toggle) {
                toggle()
              } else {
                history.push(`/projects/${theDocumentId}/${document.slug}`)
              }
            }}
          />
        </Card.Body>

      </Card>
    </div>
  )
}

registerComponent({
  name: 'ProjectsEditForm',
  component: ProjectsEditForm,
  hocs: [
    withRouter,
    withSettings
  ]
})
