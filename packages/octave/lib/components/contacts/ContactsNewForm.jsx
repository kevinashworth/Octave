import { Components, registerComponent, withAccess } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Contacts from '../../modules/contacts/collection.js'

const ContactsNewForm = ({ closeModal, history, successCallback }) => {
  return (
    <div className='animated fadeIn'>
      <Card>
        <Card.Body>
          <Components.MyHeadTags title='New Contact' />
          <Components.SmartForm
            collection={Contacts}
            successCallback={(document) => {
              if (successCallback) {
                successCallback()
              }
              if (closeModal) {
                closeModal()
              } else {
                history.push(`/contacts/${document._id}/${document.slug}`)
              }
            }}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

ContactsNewForm.propTypes = {
  closeModal: PropTypes.func, // Vulcan supplies this function
  successCallback: PropTypes.func // We must supply this if we want to run it
}

const accessOptions = {
  groups: ['editors', 'admins'],
  redirect: '/offices'
}

registerComponent({
  name: 'ContactsNewForm',
  component: ContactsNewForm,
  hocs: [
    [withAccess, accessOptions],
    withRouter
  ]
})
