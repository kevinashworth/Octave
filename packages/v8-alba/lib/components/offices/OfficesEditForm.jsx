import { Components, getFragment, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Offices from '../../modules/offices/collection.js'

const OfficesEditForm = ({ documentId, match, history, toggle }) => {
  const theDocumentId = documentId || match.params._id
  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8 Alba: Edit Office' />
      <Card className='card-accent-primary'>
        <Card.Body>
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
        </Card.Body>
      </Card>
    </div>
  )
}

registerComponent('OfficesEditForm', OfficesEditForm, withRouter)
