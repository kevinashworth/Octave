import { Components,  registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React, { PureComponent, useState } from 'react'
import PropTypes from 'prop-types'
import * as jsonpatch from 'fast-json-patch'
// import _ from 'lodash'
import moment from 'moment'
var omitDeep = require('omit-deep')
import { Button, Collapse } from 'reactstrap'
import Contacts from '../../modules/contacts/collection.js'
// import Patches from '../../modules/patches/collection.js'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'

const ContactPatch = ({ document, loading, patch }) => { // `document` is the Contact as presently in db
  if (loading) {
    return <Components.Loading />
  } else if (!document) {
    return <>No History</>
  } else {
    const [collapseIsOpen, toggleCollapse] = useState(false)
    const toggle = () => toggleCollapse(!collapseIsOpen)

    var patchedContact = jsonpatch.deepClone(omitDeep(document, ['__typename']))
    patchedContact = jsonpatch.applyPatch(patchedContact, patch.patch).newDocument

    console.log('[KA] contact:', document)
    console.log('[KA] patch:', patch.patch)
    console.log('[KA] patchedContact:', patchedContact)
    return (
      <div>
      <Button onClick={toggle}>Toggle {moment(patch.date).format(DATE_FORMAT_LONG)} Version</Button>
      <Collapse isOpen={collapseIsOpen}>
        <Components.ContactPatchDisplay document={patchedContact} />
      </Collapse>
      </div>
    )
  }
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsOnlyDirectlyEditableFieldsFragment'
}

ContactPatch.propTypes = {
  documentId: PropTypes.string.isRequired,
}

registerComponent({
  name: 'ContactPatch',
  component: ContactPatch,
  hocs: [withCurrentUser, [withSingle, options]]
})
