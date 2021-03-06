import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'

import PastProjects from '../../modules/past-projects/collection.js'

const PastProjectMini = (props) => {
  if (props.loading) {
    return <Components.Loading />
  }
  if (!props.document) {
    return <FormattedMessage id='app.404' />
  }

  const project = props.document
  return (
    <Card.Text data-cy='PastProjectMini'>
      <b><Link to={`/past-projects/${project._id}/${project.slug}`} data-cy='pastproject-link'>{project.projectTitle}</Link></b>
    </Card.Text>
  )
}

PastProjectMini.propTypes = {
  documentId: PropTypes.string.isRequired
}

const options = {
  collection: PastProjects,
  fragmentName: 'PastProjectsSingleFragment'
}

registerComponent({
  name: 'PastProjectMini',
  component: PastProjectMini,
  hocs: [
    withCurrentUser,
    [withSingle, options]
  ]
})

export default PastProjectMini
