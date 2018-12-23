import { Components, getFragment, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React from 'react'
import { withRouter } from 'react-router'
import PastProjects from '../../modules/past-projects/collection.js'

const PastProjectsEditForm = ({ documentId, params, router, toggle, currentUser }) => {
  const theDocumentId = documentId || params._id
  return (
    <div className='animated fadeIn'>
      <Components.SmartForm
        collection={PastProjects}
        documentId={theDocumentId}
        mutationFragment={getFragment('PastProjectsEditFragment')}
        showRemove={Users.canDo(currentUser, ['pastproject.delete.own', 'pastproject.delete.all'])}
        successCallback={document => {
          if (toggle) {
            toggle()
          } else {
            router.push(`/past-projects/${theDocumentId}/${document.slug}`)
          }
        }}
        removeSuccessCallback={document => {
          if (toggle) {
            toggle()
          } else {
            router.push('/past-projects/')
          }
        }}
        cancelCallback={document => {
          if (toggle) {
            toggle()
          } else {
            router.push(`/past-projects/${theDocumentId}/${document.slug}`)
          }
        }}
      />
    </div>
  )
}

registerComponent('PastProjectsEditForm', PastProjectsEditForm, withCurrentUser, withRouter)
