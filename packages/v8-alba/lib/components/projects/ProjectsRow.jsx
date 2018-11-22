import { Components, registerComponent, withCurrentUser, withDocument } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router'
import { Badge, Button } from 'reactstrap'
import moment from 'moment'
import { DATE_FORMAT_SHORT } from '../../modules/constants.js'
import Projects from '../../modules/projects/collection.js'

const ProjectsRow = ({ loading, document, currentUser }) => {
  if (loading) {
    return (
      <tr />
    )
  } else {
    const project = document
    const displayDate = project.updatedAt
      ? 'Last modified ' + moment(project.updatedAt).format(DATE_FORMAT_SHORT)
      : 'Created ' + moment(project.createdAt).format(DATE_FORMAT_SHORT)

    var badgeColor = 'danger'
    switch (project.status) {
      case 'On Hiatus':
        badgeColor = 'primary'
        break
      case 'Casting':
        badgeColor = 'success'
        break
      case 'Ordered':
        badgeColor = 'secondary'
        break
      case 'On Hold':
        badgeColor = 'info'
        break
      case 'Shooting':
        badgeColor = 'light'
        break
      case 'See Notes':
        badgeColor = 'dark'
        break
      case 'Pre-Prod.':
        badgeColor = 'warning'
        break
    }

    let fakeCompany = ''
    if (!project.castingCompany && project.contacts) {
      const reducer = (accumulator, currentValue) => {
        if (currentValue.contactTitle === 'Casting Director') {
          return accumulator + currentValue.contactName + '/'
        }
        return accumulator
      }
      fakeCompany = project.contacts.reduce(reducer, '')

      if (fakeCompany.length > 0) {
        fakeCompany = fakeCompany.slice(0, -1)
        fakeCompany += ' Casting'
      } else {
        fakeCompany = 'Unknown Casting Office'
      }
    }

    return (
      <tr>
        <td><Link to={`/projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></td>
        <td>{project.projectType}</td>
        <td>{displayDate}</td>
        <td>{project.castingCompany ? project.castingCompany : fakeCompany}</td>
        <td>
          <Badge color={badgeColor}>{project.status}</Badge>
        </td>
        <td>{Projects.options.mutations.edit.check(currentUser, project)
          ? <Components.ModalTrigger title='Edit Project' component={<Button>Edit</Button>}>
            <Components.ProjectsEditForm currentUser={currentUser} documentId={project._id} />
          </Components.ModalTrigger>
          : null
        }</td>
      </tr>
    )
  }
}

const options = {
  collection: Projects,
  queryName: 'projectsSingleQuery',
  fragmentName: 'ProjectsSingleFragment'
}

registerComponent('ProjectsRow', ProjectsRow, withCurrentUser, [withDocument, options])
