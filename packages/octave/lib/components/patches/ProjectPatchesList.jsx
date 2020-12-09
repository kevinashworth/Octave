import { Components, registerComponent, useSingle2 } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Patches from '../../modules/patches/collection.js'

const ProjectPatchesList = (props) => {
  const { documentId, project } = props
  const { patchesDocument, loading } = useSingle2({
    collection: Patches,
    input: {
      allowNull: true,
      id: documentId
    },
    propertyName: 'patchesDocument',
    queryOptions: {
      pollInterval: 0
    }
  })

  if (loading) {
    return <Components.Loading />
  }

  if (!patchesDocument) {
    return <FormattedMessage id='patches.missing_document' />
  }

  const accumulatedPatches = []
  const reversedPatches = [...patchesDocument.patches].reverse()
  accumulatedPatches[0] = {
    date: reversedPatches[0].date,
    patch: reversedPatches[0].patch
  }
  for (let i = 1; i < patchesDocument.patches.length; i++) {
    accumulatedPatches[i] = {
      date: reversedPatches[i].date,
      patch: [...accumulatedPatches[i - 1].patch, ...reversedPatches[i].patch]
    }
  }

  return (
    <Card>
      <Card.Header>
        <i className='fas fa-history' />History
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
    </Card>
  )
}

ProjectPatchesList.propTypes = {
  documentId: PropTypes.string.isRequired, // same _id for Project and Patches
  project: PropTypes.object.isRequired
}

registerComponent({
  name: 'ProjectPatchesList',
  component: ProjectPatchesList
})
