import { Components, getFragment, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Contacts from '../../modules/contacts/collection.js'
import { getMongoUrl } from '../../modules/helpers.js'

const ContactsEditForm = ({ documentId, match, history, toggle }) => {
  const theDocumentId = documentId || (match && match.params._id)
  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8: Edit Contact' />
      <Card className='card-accent-warning'>
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
        {getMongoUrl().indexOf('mlab.com') !== -1 &&
          <Card.Body>
            <Card.Link href={`https://mlab.com/databases/v8-alba-mlab/collections/contacts?_id=${theDocumentId}`} target='mLab'>Edit on mLab</Card.Link>
          </Card.Body>}
      </Card>
    </div>
  )
}

registerComponent('ContactsEditForm', ContactsEditForm, withRouter)
