import { Components,  registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React, { PureComponent, useState } from 'react'
import PropTypes from 'prop-types'
import * as jsonpatch from 'fast-json-patch'
import moment from 'moment'
import { Collapse } from 'reactstrap'
import Contacts from '../../modules/contacts/collection.js'
// import Patches from '../../modules/patches/collection.js'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'

const Patch = ({ document, loading, patch }) => { // `document` is the Contact as presently in db
  if (loading) {
    return <Components.Loading />
  } else if (!document) {
    return <>No History</>
  } else {
    const [collapseIsOpen, toggleCollapse] = useState(false)
    const toggle = () => toggleCollapse(!collapseIsOpen)

    var patchedContact = jsonpatch.deepClone(document)
    patchedContact = jsonpatch.applyPatch(patchedContact, patch.patch).newDocument

    console.log('[KA] contact:', document)
    console.log('[KA] patch:', patch.patch)
    console.log('[KA] patchedContact:', patchedContact)
    return (
      <>
      <a onClick={toggle}>{moment(patch.date).format(DATE_FORMAT_LONG)}</a>:
        <Collapse isOpen={collapseIsOpen}>
          <Components.ContactPatchDisplay document={patchedContact} />
        </Collapse>
      </>
    )
  }
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment'
}

Patch.propTypes = {
  documentId: PropTypes.string.isRequired,
}

registerComponent({
  name: 'Patch',
  component: Patch,
  hocs: [withCurrentUser, [withSingle, options]]
})
