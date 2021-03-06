import { Components, getFragment, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Contacts from '../../modules/contacts/collection.js'
import withSettings from '../../modules/hocs/withSettings.js'

const ContactsEditForm = ({ documentId, match, history, toggle, mongoProvider }) => {
  const theDocumentId = documentId || (match && match.params._id)
  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title='Edit Contact' />
      <Card className='card-accent-contacts'>
        <Card.Body>
          <Components.SmartForm
            collection={Contacts}
            documentId={theDocumentId}
            mutationFragment={getFragment('ContactsEditFragment')}
            showRemove
            successCallback={document => {
              if (toggle) {
                toggle()
              } else {
                history.push(`/contacts/${theDocumentId}/${document.slug}`)
              }
            }}
            removeSuccessCallback={document => {
              if (toggle) {
                toggle()
              } else {
                history.push('/contacts/')
              }
            }}
            cancelCallback={document => {
              if (toggle) {
                toggle()
              } else {
                history.push(`/contacts/${theDocumentId}/${document.slug}`)
              }
            }}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

registerComponent({
  name: 'ContactsEditForm',
  component: ContactsEditForm,
  hocs: [
    withRouter,
    withSettings
  ]
})
