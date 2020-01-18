import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import Projects from '../../modules/projects/collection.js'
import Patches from '../../modules/patches/collection.js'

class ProjectPatchesList extends PureComponent {
  render () {
    const { projectDocument, patchesDocument, networkStatus } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return <Components.Loading />
    } else if (!patchesDocument || !projectDocument) {
      return <FormattedMessage id='patches.missing_document' />
    } else {
      const reversedPatches = [...patchesDocument.patches].reverse()
      let accumulatedPatches = []
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
          <CardHeader>
            <i className='fa fa-history' />History
          </CardHeader>
          <CardBody>
            {accumulatedPatches.map((patch) =>
              <Components.ProjectPatch
                project={projectDocument}
                key={patch.date}
                patch={patch}
              />
            )}
          </CardBody>
          <CardFooter>
            <small className='text-muted'>This is the unused footer of ProjectPatchesList</small>
          </CardFooter>
        </Card>
      )
    }
  }
}

const patchOptions = {
  collection: Patches,
  propertyName: 'patchesDocument',
  queryOptions: {
    pollInterval: 0
  }
}

const projectOptions = {
  collection: Projects,
  fragmentName: 'ProjectsPatchesFragment',
  propertyName: 'projectDocument'
}

ProjectPatchesList.propTypes = {
  documentId: PropTypes.string.isRequired
}

registerComponent({
  name: 'ProjectPatchesList',
  component: ProjectPatchesList,
  hocs: [withCurrentUser, [withSingle, patchOptions], [withSingle, projectOptions]]
})
