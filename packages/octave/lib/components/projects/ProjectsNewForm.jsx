import { Components, registerComponent, withAccess } from 'meteor/vulcan:core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Projects from '../../modules/projects/collection.js'

const ProjectsNewForm = ({ closeModal, history, successCallback }) => {
  return (
    <div className='animated fadeIn'>
      <Card>
        <Card.Body>
          <Components.MyHeadTags title='New Project' />
          <Components.SmartForm
            collection={Projects}
            successCallback={(document) => {
              if (successCallback) {
                successCallback()
              }
              if (closeModal) {
                closeModal()
              } else {
                history.push(`/projects/${document._id}/${document.slug}`)
              }
            }}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

ProjectsNewForm.propTypes = {
  closeModal: PropTypes.func, // Vulcan supplies this function
  successCallback: PropTypes.func // We must supply this if we want to run it
}

const accessOptions = {
  groups: ['editors', 'admins'],
  redirect: '/projects'
}

registerComponent({
  name: 'ProjectsNewForm',
  component: ProjectsNewForm,
  hocs: [
    [withAccess, accessOptions],
    withRouter
  ]
})
