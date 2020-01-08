import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import * as jsonpatch from 'fast-json-patch'
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import Contacts from '../../modules/contacts/collection.js'
import Patches from '../../modules/patches/collection.js'

class PatchesList extends PureComponent {
  constructor(props) {
    super(props)
  }

  render () {
    const { patchesDocument, contactsDocument, networkStatus } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return <Components.Loading />
    } else if (!patchesDocument) {
      return <FormattedMessage id='patches.missing_document' />
    } else {
      let reversedPatches = [...patchesDocument.patches].reverse()
      let accumulatedPatches = []
      accumulatedPatches[0] = {
        date: reversedPatches[0].date,
        patch: reversedPatches[0].patch
      }
      for (var i = 1; i < patchesDocument.patches.length; i++) {
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
              contact={contactsDocument}
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

const patchOptions = {
  collection: Patches,
  propertyName: 'patchesDocument'
}

const contactOptions = {
  collection: Contacts,
  fragmentName: 'ContactsOnlyDirectlyEditableFieldsFragment',
  propertyName: 'contactsDocument'
}

PatchesList.propTypes = {
  documentId: PropTypes.string.isRequired,
}

registerComponent({
  name: 'PatchesList',
  component: PatchesList,
  hocs: [withCurrentUser, [withSingle, patchOptions], [withSingle, contactOptions]]
})
