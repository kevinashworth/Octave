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
import OfficeDisplay from './OfficeDisplay.jsx'

const OfficePatchDisplay = (props) => {
  const { collapseIsOpen, office, patch } = props
  if (!collapseIsOpen) {
    return null
  }
  if (!office) {
    return <FormattedMessage id='patches.missing_document' />
  }
  const clonedOffice = cloneDeep(omitDeep(office, ['__typename']))

  let patchedOffice = null
  try {
    patchedOffice = jsonpatch.applyPatch(clonedOffice, patch, false, false).newDocument
  } catch (e) {
    console.log('[OfficePatch] error:', e)
  }

  return <OfficeDisplay office={patchedOffice} />
}

OfficePatchDisplay.propTypes = {
  office: PropTypes.object.isRequired
}

const OfficePatch = ({ office, patch }) => {
  const [collapseIsOpen, toggleCollapse] = useState(false)
  const toggle = () => toggleCollapse(!collapseIsOpen)
  if (!office) {
    return <div>No History (OfficePatch)</div>
  }

  return (
    <div>
      <Button variant='secondary' onClick={toggle} className='mb-1'>Toggle {moment(patch.date).format(DATE_FORMAT_LONG)} Version</Button>
      <Collapse isOpen={collapseIsOpen}>
        <OfficePatchDisplay office={office} patch={patch.patch} collapseIsOpen={collapseIsOpen} />
      </Collapse>
    </div>
  )
}

OfficePatch.propTypes = {
  office: PropTypes.object.isRequired
}

registerComponent({
  name: 'OfficePatch',
  component: OfficePatch
})
