import { registerComponent, withSingle } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Projects from '../../modules/projects/collection.js'
import MyLoading from '../common/MyLoading'

const MyLoader = () => {
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
  const { document: project, titleForProject } = props
  if (!project) {
    return <MyLoader />
  }

  const TitleForProject = ({ titleForProject }) => {
    return (
      <>
        {' '}
        (<span data-cy='title-for-project'>{titleForProject}</span>)
      </>
    )
  }

  return (
    <Card.Text className='card-mini' data-cy='ProjectMini'>
      <b><Link to={`/projects/${project._id}/${project.slug}`} data-cy='project-link'>{project.projectTitle}</Link></b>
      {titleForProject && <TitleForProject titleForProject={titleForProject} />}
      <br />
      <small data-cy='project-type-network-status'>
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
    [withSingle, options]
  ]
})

export default ProjectMini
