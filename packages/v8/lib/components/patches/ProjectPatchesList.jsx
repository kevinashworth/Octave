import { Components, registerComponent, withSingle2 } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'
import mapProps from 'recompose/mapProps'
import Card from 'react-bootstrap/Card'
import Patches from '../../modules/patches/collection.js'

const ProjectPatchesList = (props) => {
  const { loading, patchesDocument, project } = props
  if (loading) {
    return <Components.Loading />
  }
  if (!patchesDocument) {
    return <FormattedMessage id='patches.missing_document' />
  }

  var accumulatedPatches = []
  const reversedPatches = [...patchesDocument.patches].reverse()
  accumulatedPatches[0] = {
    date: reversedPatches[0].date,
    patch: reversedPatches[0].patch
  }
  for (var i = 1; i < patchesDocument.patches.length; i++) {
    accumulatedPatches[i] = {
      date: reversedPatches[i].date,
      patch: [...accumulatedPatches[i - 1].patch, ...reversedPatches[i].patch]
    }
  }

  return (
    <Card>
      <Card.Header>
        <i className='fa fa-history' />History
      </Card.Header>
      <Card.Body>
        {accumulatedPatches.map((patch) =>
          <Components.ProjectPatch
            key={patch.date}
            patch={patch}
            project={project}
          />
        )}
      </Card.Body>
      <Card.Footer>
        <small className='text-muted'>This is the unused footer of ProjectPatchesList</small>
      </Card.Footer>
    </Card>
  )
}

const options = {
  collection: Patches,
  propertyName: 'patchesDocument',
  queryOptions: {
    pollInterval: 0
  }
}

ProjectPatchesList.propTypes = {
  documentId: PropTypes.string.isRequired, // same _id for Project and Patches
  project: PropTypes.object.isRequired
}

const mapPropsFunction = (props) => {
  return {
    ...props,
    input: {
      allowNull: true,
      id: props.documentId
    }
  }
}

registerComponent({
  name: 'ProjectPatchesList',
  component: ProjectPatchesList,
  hocs: [
    mapProps(mapPropsFunction), [withSingle2, options]
  ]
})
