import { Components,  registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import * as jsonpatch from 'fast-json-patch'
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
// import Contacts from '../../modules/contacts/collection.js'
import Patches from '../../modules/patches/collection.js'

class PatchesList extends PureComponent {
  constructor(props) {
    super(props)
  }

  render () {
    const { contact, document, networkStatus } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return <Components.Loading />
    } else if (!document) {
      return <FormattedMessage id='app.missing_document' />
    } else {
      let reversedPatches = [...document.patches].reverse()
      let accumulatedPatches = []
      accumulatedPatches[0] = {
        date: reversedPatches[0].date,
        patch: reversedPatches[0].patch
      }
      for (var i = 1; i < document.patches.length; i++) {
        accumulatedPatches[i] = {
          date: reversedPatches[i].date,
          patch: [...accumulatedPatches[i-1].patch, ...reversedPatches[i].patch]
        }
      }

      return (
        <Card>
          <CardHeader>
            <i className='fa fa-history' />History
          </CardHeader>
          <CardBody>
            {accumulatedPatches.map((patch) => <Components.ContactPatch
              collectionName={document.collectionName}
              contact={contact}
              key={patch.date}
              patch={patch} />)}
          </CardBody>
          <CardFooter>
            <small className='text-muted'>This is the unused footer of PatchesList</small>
          </CardFooter>
        </Card>
      )
    }
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
