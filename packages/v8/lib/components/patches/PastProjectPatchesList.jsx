import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import PastProjects from '../../modules/past-projects/collection.js'
import Patches from '../../modules/patches/collection.js'
import withSettings from '../../modules/hocs/withSettings.js'
import { MLAB } from '../../modules/constants.js'

const PastProjectPatchesList = (props) => {
  const { pastProjectDocument, patchesDocument, loading, currentUser, mongoProvider } = props
  var accumulatedPatches = []
  if (loading) {
    return <Components.Loading />
  } else if (!patchesDocument || !pastProjectDocument) {
    return <FormattedMessage id='patches.missing_document' />
  } else {
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
            project={pastProjectDocument}
          />
        )}
      </Card.Body>
      {Users.isAdmin(currentUser) && mongoProvider === MLAB &&
        <Card.Body>
          <Card.Link href={`https://mlab.com/databases/v8-alba-mlab/collections/patches?_id=${patchesDocument._id}`} target={MLAB}>Edit on mLab</Card.Link>
        </Card.Body>}
      <Card.Footer>
        <small className='text-muted'>This is the unused footer of PastProjectPatchesList</small>
      </Card.Footer>
    </Card>
  )
}

const patchOptions = {
  collection: Patches,
  propertyName: 'patchesDocument',
  queryOptions: {
    pollInterval: 0
  }
}

const projectOptions = {
  collection: PastProjects,
  fragmentName: 'PastProjectsPatchesFragment',
  propertyName: 'pastProjectDocument'
}

PastProjectPatchesList.propTypes = {
  documentId: PropTypes.string.isRequired
}

registerComponent({
  name: 'PastProjectPatchesList',
  component: PastProjectPatchesList,
  hocs: [
    withCurrentUser,
    [withSingle, patchOptions],
    [withSingle, projectOptions],
    withSettings
  ]
})
