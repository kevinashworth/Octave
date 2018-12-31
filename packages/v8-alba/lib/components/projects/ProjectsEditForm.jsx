import { Components, getFragment, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React from 'react'
import { withRouter } from 'react-router'
import Projects from '../../modules/projects/collection.js'
import { PAST_PROJECT_STATUSES_ARRAY } from '../../modules/constants.js'
import _ from 'lodash'

const ProjectsEditForm = ({ documentId, params, router, toggle, currentUser }) => {
  const theDocumentId = documentId || params._id
  return (
    <div className='animated fadeIn'>
      <Components.SmartForm
        collection={Projects}
        documentId={theDocumentId}
        mutationFragment={getFragment('ProjectsEditFragment')}
        showRemove={Users.canDo(currentUser, ['project.delete.own', 'project.delete.all'])}
        successCallback={document => {
          if (_.includes(PAST_PROJECT_STATUSES_ARRAY, document.status)) {
            router.push(`/past-projects/${theDocumentId}/${document.slug}`)
          } else if (toggle) {
            toggle()
          } else {
            router.push(`/projects/${theDocumentId}/${document.slug}`)
          }
        }}
        removeSuccessCallback={document => {
          if (toggle) {
            toggle()
          } else {
            router.push('/projects/')
          }
        }}
        cancelCallback={document => {
          if (toggle) {
            toggle()
          } else {
            router.push(`/projects/${theDocumentId}/${document.slug}`)
          }
        }}
      />
    </div>
  )
}

registerComponent('ProjectsEditForm', ProjectsEditForm, withCurrentUser, withRouter)
