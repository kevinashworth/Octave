import { Components,  registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import * as jsonpatch from 'fast-json-patch'
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
// import Contacts from '../../modules/contacts/collection.js'
import Patches from '../../modules/patches/collection.js'

function preparePatches (patches) {
  let myPatches = patches.reverse()
  let newPatches = []
  newPatches[0] = {
    date: myPatches[0].date,
    patch: myPatches[0].patch
  }
  // newPatches[2] = {
  //   date: myPatches[2].date,
  //   patch: newPatches[1].patch.concat(myPatches[2].patch)
  // }
  for (var i = 1; i < newPatches.length; i++) {
    newPatches[i] = {
      date: myPatches[i].date,
      patch: newPatches[i-1].patch.concat(myPatches[i].patch)
    }
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
    console.log('PatchesList document:', document)
    console.log('PatchesList patches:', patches)
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
          <small className='text-muted'>This is the unused footer</small>
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
