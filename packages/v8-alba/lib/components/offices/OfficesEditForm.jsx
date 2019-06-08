import { Components, getFragment, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Offices from '../../modules/offices/collection.js'

const OfficesEditForm = ({ documentId, params, history, toggle }) => {
  const theDocumentId = documentId || params._id
  return (
    <div className='animated fadeIn'>
      <Components.SmartForm
        collection={Offices}
        documentId={theDocumentId}
        mutationFragment={getFragment('OfficesEditFragment')}
        showRemove
        successCallback={document => {
          if (toggle) {
            toggle()
          } else {
            history.push(`/offices/${theDocumentId}`)
          }
        }}
        cancelCallback={document => {
          if (toggle) {
            toggle()
          } else {
            history.push(`/offices/${theDocumentId}`)
          }
        }}
        removeSuccessCallback={document => {
          if (toggle) {
            toggle()
          } else {
            history.push('/offices/')
          }
        }}
      />
    </div>
  )
}

registerComponent('OfficesEditForm', OfficesEditForm, withRouter)
