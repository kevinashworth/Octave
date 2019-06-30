import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CardText } from 'reactstrap'
import Projects from '../../modules/projects/collection.js'

const ProjectMini = (props) => {
  if (props.loading) {
    return (<div><Components.Loading /></div>)
  }
  if (!props.document) {
    return (<div><FormattedMessage id='app.404' /></div>)
  }

  const project = props.document
  return (
    <CardText><b><Link to={`/projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></b></CardText>
  )
}

ProjectMini.propTypes = {
  documentId: PropTypes.string.isRequired
}

const options = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment'
}

registerComponent('ProjectMini', ProjectMini, withCurrentUser, [withSingle, options])
