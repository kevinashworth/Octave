import { Components, registerComponent, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Offices from '../../modules/offices/collection.js'
import Patches from '../../modules/patches/collection.js'

const OfficePatchesList = (props) => {
  const { officeDocument, patchesDocument, loading } = props
  const accumulatedPatches = []
  if (loading) {
    return <Components.Loading />
  } else if (!patchesDocument || !officeDocument) {
    return <FormattedMessage id='patches.missing_document' />
  } else {
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
  }
  return (
    <Card>
      <Card.Header>
        <i className='fas fa-history' />History
      </Card.Header>
      <Card.Body>
        {accumulatedPatches.map((patch) =>
          <Components.OfficePatch
            office={officeDocument}
            key={patch.date}
            patch={patch}
          />
        )}
      </Card.Body>
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

const officeOptions = {
  collection: Offices,
  fragmentName: 'OfficesPatchesFragment',
  propertyName: 'officeDocument'
}

OfficePatchesList.propTypes = {
  documentId: PropTypes.string.isRequired
}

registerComponent({
  name: 'OfficePatchesList',
  component: OfficePatchesList,
  hocs: [
    [withSingle, patchOptions],
    [withSingle, officeOptions]
  ]
})
