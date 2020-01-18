import { Components, getFragment, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'
import Projects from '../../modules/projects/collection.js'
import { PAST_PROJECT_STATUSES_ARRAY } from '../../modules/constants.js'
import _ from 'lodash'

const ProjectsEditForm = ({ documentId, match, history, toggle, currentUser }) => {
  const theDocumentId = documentId || (match && match.params._id)
  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8 Alba: Edit Project' />
      <Card className='card-accent-danger'>
        <CardBody>
          <Components.SmartForm
            collection={Projects}
            documentId={theDocumentId}
            mutationFragment={getFragment('ProjectsEditFragment')}
            showRemove={Users.canDo(currentUser, ['project.delete.own', 'project.delete.all'])}
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
        </CardBody>
      </Card>
    </div>
  )
}

registerComponent('ProjectsEditForm', ProjectsEditForm, withCurrentUser, withRouter)
//
// submitCallback={data => {
//   console.log('[KA] submitCallback data:', data)
//   if (_.includes(PAST_PROJECT_STATUSES_ARRAY, data.status)) {
//     history.push(`/past-projects/${theDocumentId}/${data.slug}`)
//   } else if (toggle) {
//     toggle()
//   } else {
//     history.push(`/projects/${theDocumentId}/${data.slug}`)
//   }
// }}
