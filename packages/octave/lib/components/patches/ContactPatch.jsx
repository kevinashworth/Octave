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
import ContactDisplay from './ContactDisplay.jsx'

const ContactPatchDisplay = (props) => {
  const { collapseIsOpen, contact, patch } = props
  if (!collapseIsOpen) {
    return null
  }
  if (!contact) {
    return <FormattedMessage id='patches.missing_document' />
  }
  const clonedContact = cloneDeep(omitDeep(contact, ['__typename']))

  let patchedContact = null
  try {
    patchedContact = jsonpatch.applyPatch(clonedContact, patch, false, false).newDocument
  } catch (e) {
    console.log('[ContactPatch] error:', e)
  }

  return <ContactDisplay contact={patchedContact} />
}

ContactPatchDisplay.propTypes = {
  contact: PropTypes.object.isRequired
}

const ContactPatch = ({ contact, patch }) => {
  const [collapseIsOpen, toggleCollapse] = useState(false)
  const toggle = () => toggleCollapse(!collapseIsOpen)
  if (!contact) {
    return <div>No History (ContactPatch)</div>
  }

  return (
    <div>
      <Button variant='secondary' onClick={toggle} className='mb-1'>Toggle {moment(patch.date).format(DATE_FORMAT_LONG)} Version</Button>
      <Collapse isOpen={collapseIsOpen}>
        <ContactPatchDisplay contact={contact} patch={patch.patch} collapseIsOpen={collapseIsOpen} />
      </Collapse>
    </div>
  )
}

ContactPatch.propTypes = {
  contact: PropTypes.object.isRequired
}

registerComponent({
  name: 'ContactPatch',
  component: ContactPatch
})
