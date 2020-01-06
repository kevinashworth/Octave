import { Components,  registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React, { PureComponent, useState } from 'react'
import PropTypes from 'prop-types'
// import * as jsonpatch from 'fast-json-patch'
import { Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText, Collapse } from 'reactstrap'
// import Contacts from '../../modules/contacts/collection.js'
import Patches from '../../modules/patches/collection.js'

function preparePatches (patches) {
  let myPatches = patches.reverse()
  // myPatches.forEach((patch, index) => {
  //
  // })

  let newPatches = []
  newPatches[0] = {
    date: myPatches[0].date,
    patch: myPatches[0].patch
  }
  newPatches[1] = {
    date: myPatches[1].date,
    patch: newPatches[0].patch.concat(myPatches[1].patch)
  }

  console.log('newPatches:', newPatches)
  return newPatches
}

const PatchesList = ({ document, loading }) => { // `document` is the patches object for this Contact
  if (loading) {
    return <Components.Loading />
  } else if (!document) {
    return <>No History</>
  } else {
    const { patches } = document
    console.log('what the hell is this document:', document)
    console.log('what the hell are these patches:', patches)
    const preparedPatches = preparePatches(patches)
    return (
      <Card>
        <CardHeader>
          <i className='fa fa-history' />History
        </CardHeader>
        <CardBody>
          {preparedPatches.map((patch) => <Components.ContactPatch
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
