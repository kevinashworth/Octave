import { registerComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse } from 'reactstrap'
import * as jsonpatch from 'fast-json-patch'
import _ from 'lodash'
import moment from 'moment'
// var omitDeep = require('omit-deep')
import omitDeep from 'omit-deep'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import ContactDisplay from './ContactDisplay.jsx'

class ContactPatchDisplay extends Component {
  render () {
    const { collapseIsOpen, contact, patch } = this.props
    if (!collapseIsOpen) {
      return null
    }
    if (!contact) {
      return <FormattedMessage id='patches.missing_document' />
    }
    var clonedContact = _.cloneDeep(omitDeep(contact, ['__typename']))
    // console.log('[ContactPatchDisplay] clonedContact:', clonedContact)

    var patchedContact = contact
    try {
      patchedContact = jsonpatch.applyPatch(clonedContact, patch.patch).newDocument
    } catch (e) {
      console.log('[ContactPatch] error:', e)
    }
    // console.log('[ContactPatchDisplay] patch:', patch.patch)
    // console.log('[ContactPatchDisplay] patchedContact:', patchedContact)

    return <ContactDisplay contact={patchedContact} />
  }
}

ContactPatchDisplay.propTypes = {
  contact: PropTypes.object.isRequired
}

const ContactPatch = ({ contact, patch }) => {
  if (!contact) {
    return <div>No History (ContactPatch)</div>
  } else {
    const [collapseIsOpen, toggleCollapse] = useState(false)
    const toggle = () => toggleCollapse(!collapseIsOpen)

    return (
      <div>
        <Button onClick={toggle}>Toggle {moment(patch.date).format(DATE_FORMAT_LONG)} Version</Button>
        <Collapse isOpen={collapseIsOpen}>
          <ContactPatchDisplay contact={contact} patch={patch} collapseIsOpen={collapseIsOpen} />
        </Collapse>
      </div>
    )
  }
}

ContactPatch.propTypes = {
  contact: PropTypes.object.isRequired
}

registerComponent({
  name: 'ContactPatch',
  component: ContactPatch
})
