import { Components, getFragment, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Offices from '../../modules/offices/collection.js'
import withSettings from '../../modules/hocs/withSettings.js'

const OfficesEditForm = ({ documentId, match, history, toggle, mongoProvider }) => {
  const theDocumentId = documentId || match.params._id
  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title='Edit Office' />
      <Card className='card-accent-offices'>
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

registerComponent({
  name: 'OfficesEditForm',
  component: OfficesEditForm,
  hocs: [
    withRouter,
    withSettings
  ]
})
