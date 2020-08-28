import { registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Projects from '../../modules/projects/collection.js'
import MyLoading from '../common/MyLoading'

const MyLoader = ({ cardClass }) => {
  return (
    <Card.Text className='card-mini'>
      <MyLoading variant='primary' />
      <br />
      <small>
        <MyLoading />
      </small>
    </Card.Text>
  )
}

const ProjectMini = (props) => {
  if (!props.document) {
    return <MyLoader />
  }

  const project = props.document
  return (
    <Card.Text className='card-mini'>
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

export default ProjectMini
