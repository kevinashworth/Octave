import { Components,  registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText } from 'reactstrap'
import Patches from '../../modules/patches/collection.js'

const Diff = ({ patch }) => {
  return (
    <>
    <CardSubtitle>{patch.date}:</CardSubtitle>
    <CardText>{JSON.stringify(patch.patch)}</CardText>
    </>
  )
}

const PatchesList = ({ document, loading }) => {
  if (loading) {
    return <Components.Loading />
  }
  if (!document) {
    return <>No History</>
  }
  const patches = document.patches
  return (
    <Card>
      <CardHeader>
        <i className='fa fa-history' />History
      </CardHeader>
      <CardBody>
        {patches.map((patch, index) => <Diff key={index} patch={patch} />)}
      </CardBody>
      <CardFooter>
        This is the footer
      </CardFooter>
    </Card>
  )
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
