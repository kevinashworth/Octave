import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Statistics from '../../modules/statistics/collection.js'

const StatisticsEditForm = ({ loading, documentId, params, router, toggle }) => {
  if (loading) {
    return (<div><Components.Loading /></div>)
  }
  const theDocumentId = documentId || params._id
  const theHandler = (document) => {
    if (toggle) {
      toggle()
    }
  }
  return (
    <div className='animated fadeIn'>
      <Components.SmartForm
        collection={Statistics}
        documentId={theDocumentId}
        successCallback={theHandler}
        removeSuccessCallback={theHandler}
        cancelCallback={theHandler}
      />
    </div>
  )
}

registerComponent('StatisticsEditForm', StatisticsEditForm, withRouter)
