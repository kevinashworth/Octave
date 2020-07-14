import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Contacts from '../../modules/contacts/collection.js'
import Patches from '../../modules/patches/collection.js'
import withSettings from '../../modules/hocs/withSettings.js'
import { MLAB } from '../../modules/constants.js'

const ContactPatchesList = (props) => {
  const { contactDocument, patchesDocument, loading, currentUser, mongoProvider } = props
  var accumulatedPatches = []
  if (loading) {
    return <Components.Loading />
  } else if (!patchesDocument || !contactDocument) {
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
          <Components.ContactPatch
            contact={contactDocument}
            key={patch.date}
            patch={patch}
          />
        )}
      </Card.Body>
      {Users.isAdmin(currentUser) && mongoProvider === MLAB &&
        <Card.Body>
          <Button href={`https://mlab.com/databases/v8-alba-mlab/collections/patches?_id=${patchesDocument._id}`} target={MLAB}>Edit History on mLab</Button>
        </Card.Body>}
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

const contactOptions = {
  collection: Contacts,
  fragmentName: 'ContactsPatchesFragment',
  propertyName: 'contactDocument'
}

ContactPatchesList.propTypes = {
  documentId: PropTypes.string.isRequired
}

registerComponent({
  name: 'ContactPatchesList',
  component: ContactPatchesList,
  hocs: [
    withCurrentUser,
    withSettings,
    [withSingle, patchOptions],
    [withSingle, contactOptions]
  ]
})
