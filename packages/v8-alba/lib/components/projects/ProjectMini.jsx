import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
// import { CardText } from 'reactstrap'
import Card from 'react-bootstrap/Card'

import Projects from '../../modules/projects/collection.js'

const ProjectMini = (props) => {
  if (props.loading) {
    return <Components.Loading />
  }
  if (!props.document) {
    return <FormattedMessage id='app.404' />
  }

  const project = props.document
  return (
    <Card.Text>
      <b><Link to={`/projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></b>
      {props.titleForProject && ` (${props.titleForProject})`}
      <br />
      <small>
        {project.projectType} {project.network && ` – ${project.network} `} ({project.status})
      </small>
    </Card.Text>
  )
}

ProjectMini.propTypes = {
  documentId: PropTypes.string.isRequired
}

const options = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment'
}

registerComponent({
  name: 'ProjectMini',
  component: ProjectMini,
  hocs: [
    withCurrentUser,
    [withSingle, options]
  ]
})
