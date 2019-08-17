import { Components, registerComponent } from 'meteor/vulcan:core'
import React from 'react'
import Projects from '../../modules/projects/collection.js'

const ProjectsNewForm = ({ toggle }) =>
  <div className='animated fadeIn'>
    <Components.SmartForm
      collection={Projects}
      successCallback={document => {
        if (toggle) {
          toggle()
        }
      }}
    />
  </div>

registerComponent('ProjectsNewForm', ProjectsNewForm)
