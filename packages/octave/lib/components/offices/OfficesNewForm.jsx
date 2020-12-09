import { Components, registerComponent, withAccess } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Offices from '../../modules/offices/collection.js'

const OfficesNewForm = ({ closeModal, history, successCallback }) => {
  return (
    <div className='animated fadeIn'>
      <Card>
        <Card.Body>
          <Components.MyHeadTags title='New Office' />
          <Components.SmartForm
            collection={Offices}
            successCallback={(document) => {
              if (successCallback) {
                successCallback()
              }
              if (closeModal) {
                closeModal()
              } else {
                history.push(`/offices/${document._id}/${document.slug}`)
              }
            }}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

OfficesNewForm.propTypes = {
  closeModal: PropTypes.func, // Vulcan supplies this function
  successCallback: PropTypes.func // We must supply this if we want to run it
}

const accessOptions = {
  groups: ['editors', 'admins'],
  redirect: '/offices'
}

registerComponent({
  name: 'OfficesNewForm',
  component: OfficesNewForm,
  hocs: [
    [withAccess, accessOptions],
    withRouter
  ]
})
