import { Components, getFragment, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import PastProjects from '../../modules/past-projects/collection.js'
import { ACTIVE_PROJECT_STATUSES_ARRAY } from '../../modules/constants.js'
import { getMongoUrl } from '../../modules/helpers.js'
import _ from 'lodash'

const PastProjectsEditForm = ({ documentId, match, history, toggle }) => {
  const theDocumentId = documentId || match.params._id
  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8: Edit Past Project' />
      <Card className='card-accent-secondary'>
        <Card.Body>
          <Components.SmartForm
            collection={PastProjects}
            documentId={theDocumentId}
            mutationFragment={getFragment('PastProjectsEditFragment')}
            showRemove
            successCallback={document => {
              if (_.includes(ACTIVE_PROJECT_STATUSES_ARRAY, document.status)) {
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
        {getMongoUrl().indexOf('mlab.com') !== -1 &&
          <Card.Body>
            <Card.Link href={`https://mlab.com/databases/v8-alba-mlab/collections/pastprojects?_id=${theDocumentId}`} target='mLab'>Edit on mLab</Card.Link>
          </Card.Body>}
      </Card>
    </div>
  )
}

registerComponent('PastProjectsEditForm', PastProjectsEditForm, withRouter)
