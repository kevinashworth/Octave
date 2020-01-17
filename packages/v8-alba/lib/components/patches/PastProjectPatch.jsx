import { Components,  registerComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse } from 'reactstrap'
import * as jsonpatch from 'fast-json-patch'
import _ from 'lodash'
import moment from 'moment'
var omitDeep = require('omit-deep')
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import ProjectDisplay from './ProjectDisplay.jsx'

class PastProjectPatchDisplay extends PureComponent {
  constructor(props) {
    super(props)
  }

  render () {
    const { collapseIsOpen, project, patch } = this.props
    if (!collapseIsOpen) {
      return null
    }
    if (!project) {
      return <FormattedMessage id='patches.missing_document' />
    }
    var clonedProject = _.cloneDeep(omitDeep(project, ['__typename']))
    // console.log('[ProjectPatchDisplay] clonedProject:', clonedProject)

    var patchedProject = project
    try {
      patchedProject= jsonpatch.applyPatch(clonedProject, patch.patch).newDocument
    }
    catch (e) {
      console.log('[ProjectPatch] error:', e)
    }
    // console.log('[ProjectPatchDisplay] patch:', patch.patch)
    // console.log('[ProjectPatchDisplay] patchedProject:', patchedProject)

    return <ProjectDisplay project={patchedProject} />
  }
}

PastProjectPatchDisplay.propTypes = {
  project: PropTypes.object.isRequired,
}

const PastProjectPatch = ({ project, patch }) => {
  if (!project) {
    return <div>No History (PastProjectPatch)</div>
  } else {
    const [collapseIsOpen, toggleCollapse] = useState(false)
    const toggle = () => toggleCollapse(!collapseIsOpen)

    return (
      <div>
      <Button onClick={toggle}>Toggle {moment(patch.date).format(DATE_FORMAT_LONG)} Version</Button>
      <Collapse isOpen={collapseIsOpen}>
        <PastProjectPatchDisplay project={project} patch={patch} collapseIsOpen={collapseIsOpen} />
      </Collapse>
      </div>
    )
  }
}

PastProjectPatch.propTypes = {
  project: PropTypes.object.isRequired,
}

registerComponent({
  name: 'PastProjectPatch',
  component: PastProjectPatch
})
