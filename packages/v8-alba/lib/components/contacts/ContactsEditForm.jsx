import { Components, getFragment, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'
import Contacts from '../../modules/contacts/collection.js'

const ContactsEditForm = ({ documentId, match, history, toggle, currentUser }) => {
  const theDocumentId = documentId || match.params._id
  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8 Alba: Edit Contact' />
      <Card className='card-accent-warning'>
        <CardBody>
          <Components.SmartForm
            collection={Contacts}
            documentId={theDocumentId}
            mutationFragment={getFragment('ContactsEditFragment')}
            showRemove={Users.canDo(currentUser, 'contact.delete.own')}
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
        </CardBody>
      </Card>
    </div>
  )
}

registerComponent('ContactsEditForm', ContactsEditForm, withCurrentUser, withRouter)
