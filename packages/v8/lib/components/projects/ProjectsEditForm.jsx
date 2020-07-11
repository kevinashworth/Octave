import { Components, getFragment, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Projects from '../../modules/projects/collection.js'
import { PAST_PROJECT_STATUSES_ARRAY } from '../../modules/constants.js'
import _ from 'lodash'

const ProjectsEditForm = ({ documentId, match, history, toggle }) => {
  const theDocumentId = documentId || (match && match.params._id)
  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8: Edit Project' />
      <Card className='card-accent-danger'>
        <Card.Body>
          <Components.SmartForm
            collection={Projects}
            documentId={theDocumentId}
            mutationFragment={getFragment('PastProjectsEditFragment')}
            showRemove
            successCallback={document => {
              if (_.includes(PAST_PROJECT_STATUSES_ARRAY, document.status)) {
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
        <Card.Body>
          <Card.Link href={`https://mlab.com/databases/v8-alba-mlab/collections/projects?_id=${theDocumentId}`} target='mLab'>Edit on mLab</Card.Link>
        </Card.Body>
      </Card>
    </div>
  )
}

registerComponent('ProjectsEditForm', ProjectsEditForm, withRouter)
