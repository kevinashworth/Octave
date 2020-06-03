import { Components, getFragment, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import PastProjects from '../../modules/past-projects/collection.js'
import { ACTIVE_PROJECT_STATUSES_ARRAY } from '../../modules/constants.js'
import _ from 'lodash'

const PastProjectsEditForm = ({ documentId, match, history, toggle, currentUser }) => {
  const theDocumentId = documentId || match.params._id
  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8 Alba: Edit Past Project' />
      <Card className='card-accent-secondary'>
        <Card.Body>
          <Components.SmartForm
            collection={PastProjects}
            documentId={theDocumentId}
            mutationFragment={getFragment('PastProjectsEditFragment')}
            showRemove={Users.canDo(currentUser, ['pastproject.delete.own', 'pastproject.delete.all'])}
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
      </Card>
    </div>
  )
}

registerComponent('PastProjectsEditForm', PastProjectsEditForm, withCurrentUser, withRouter)
