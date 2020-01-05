import { Components,  registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React, { PureComponent, useState } from 'react'
import PropTypes from 'prop-types'
// import * as jsonpatch from 'fast-json-patch'
import { Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText, Collapse } from 'reactstrap'
// import Contacts from '../../modules/contacts/collection.js'
import Patches from '../../modules/patches/collection.js'

const PatchesList = ({ document, loading }) => { // `document` is the patches object for this Contact
  if (loading) {
    return <Components.Loading />
  } else if (!document) {
    return <>No History</>
  } else {
    const { patches } = document
    console.log('what the hell is this document:', document)
    console.log('what the hell are these patches:', patches)
    return (
      <Card>
        <CardHeader>
          <i className='fa fa-history' />History
        </CardHeader>
        <CardBody>
          {patches.map((patch) => <Components.Patch
            collectionName={document.collectionName}
            documentId={document._id}
            key={patch.date}
            patch={patch} />)}
        </CardBody>
        <CardFooter>
          This is the footer
        </CardFooter>
      </Card>
    )
  }
}

const options = {
  collection: Patches
}

PatchesList.propTypes = {
  documentId: PropTypes.string.isRequired,
}

registerComponent({
  name: 'PatchesList',
  component: PatchesList,
  hocs: [withCurrentUser, [withSingle, options]]
})
