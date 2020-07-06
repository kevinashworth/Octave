import { registerComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'
import * as jsonpatch from 'fast-json-patch'
import cloneDeep from 'lodash/cloneDeep'
import moment from 'moment'
import omitDeep from 'omit-deep'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import ProjectDisplay from './ProjectDisplay.jsx'

const ProjectPatchDisplay = (props) => {
  const { collapseIsOpen, project, patch } = props
  if (!collapseIsOpen) {
    return null
  }
  if (!project) {
    return <FormattedMessage id='patches.missing_document' />
  }
  var clonedProject = cloneDeep(omitDeep(project, ['__typename']))

  var patchedProject = null
  try {
    patchedProject = jsonpatch.applyPatch(clonedProject, patch, false, false).newDocument
  } catch (e) {
    console.log('[ProjectPatch] error:', e)
  }

  return <ProjectDisplay project={patchedProject} />
}

ProjectPatchDisplay.propTypes = {
  project: PropTypes.object.isRequired
}

const ProjectPatch = ({ project, patch }) => {
  const [collapseIsOpen, toggleCollapse] = useState(false)
  const toggle = () => toggleCollapse(!collapseIsOpen)
  if (!project) {
    return <div>No History (ProjectPatch)</div>
  }

  return (
    <div>
      <Button variant='secondary' onClick={toggle} className='mb-1'>Toggle {moment(patch.date).format(DATE_FORMAT_LONG)} Version</Button>
      <Collapse isOpen={collapseIsOpen}>
        <ProjectPatchDisplay project={project} patch={patch.patch} collapseIsOpen={collapseIsOpen} />
      </Collapse>
    </div>
  )
}

ProjectPatch.propTypes = {
  project: PropTypes.object.isRequired
}

registerComponent({
  name: 'ProjectPatch',
  component: ProjectPatch
})
