import { Components, getFragment, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Offices from '../../modules/offices/collection.js'

const OfficesNewForm = ({ documentId, match, history, toggle }) => {
  const theDocumentId = documentId || match.params._id
  return (
    <div className='animated fadeIn'>
      <Components.SmartForm
        collection={Offices}
        documentId={theDocumentId}
        mutationFragment={getFragment('OfficesItemFragment')}
        successCallback={document => {
          if (toggle) {
            toggle()
          } else {
            history.push(`/offices/${theDocumentId}`)
          }
        }}
      />
    </div>
  )
}

registerComponent('OfficesNewForm', OfficesNewForm, withRouter)
