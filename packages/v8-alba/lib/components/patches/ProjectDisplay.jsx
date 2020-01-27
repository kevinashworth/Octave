import { Components } from 'meteor/vulcan:core'
import React from 'react'
import { Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle } from 'reactstrap'
import Interweave from 'interweave'
import moment from 'moment'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import { getFullAddress, transform } from '../../modules/helpers.js'

const ProjectDisplay = ({ project }) => {
  const seasonorder = (project) => {
    if (!project.season) {
      return null
    }
    var so = 'Season Info Missing'
    if (project.renewed && (project.status === 'On Hiatus' || project.status === 'Ordered')) {
      so = `Renewed for Season ${project.season}`
    } else if (project.status === 'On Hiatus' || project.status === 'Wrapped' || project.status === 'Canceled') {
      so = `Completed Season ${project.season}`
    }
    if (project.status === 'Casting' || project.status === 'See Notes') {
      so = `Season ${project.season}`
    }
    if (project.order) {
      so += ` (${project.order}-episode order)`
    }
    return <div>{so}</div>
  }
  const displayDate =
    'Project as it was in the database before it was edited ' + moment(project.updatedAt).format(DATE_FORMAT_LONG)
  return (
    <Card className='card-accent-danger'>
      <CardHeader tag='h2'>{project.projectTitle}</CardHeader>
      <CardBody>
        <CardTitle><b>Project Information</b></CardTitle>
        <CardText tag='div'>
          <b>{project.projectTitle}</b><br />
          {project.projectType}{project.network && ` – ${project.network}`}<br />
          {project.union}{project.platformType && ` (${project.platformType})`}<br />
          {seasonorder(project)}
          {project.status}
        </CardText>
        <hr />
        {project.htmlSummary
          ? <Interweave content={project.htmlSummary} transform={transform} />
          : <CardText>{project.summary}</CardText>
        }
        {project.htmlNotes
          ? <Interweave content={project.htmlNotes} transform={transform} />
          : <CardText>{project.notes}</CardText>
        }
        {project.shootingLocation &&
          <CardText><b>Shooting Location</b>: {project.shootingLocation}</CardText>
        }
        <hr />
        {project.website &&
          <CardText>
            <CardLink href={project.website} target='_websites'>Open official website <i className='fa fa-external-link' /></CardLink>
          </CardText>
        }
        <CardTitle className='mt-5'><b>Casting Information</b></CardTitle>
        <CardText className='mb-0'>
          <b>{project.castingCompany}</b>
        </CardText>
        {project.castingOfficeId &&
          <Components.OfficeMini documentId={project.castingOfficeId} />
        }
        {project.contacts &&
          project.contacts.map(contact => <Components.ContactDetail key={contact.contactId} contact={contact} />)
        }
        {project.addresses && project.addresses[0] &&
          project.addresses.map((address, index) => <Components.AddressDetail key={getFullAddress(address) + index} address={address} />)
        }
        {project.contactId}
        {project.links &&
          <CardTitle className='mt-5'><b>Links</b></CardTitle>
        }
        {project.links &&
          <CardText>
            {project.links.map((link, index) =>
              <Components.LinkDetail key={`link-detail-${index}`} link={link} />
            )}
          </CardText>
        }
      </CardBody>
      <CardFooter>
        <span className='text-muted'>{displayDate}</span>
      </CardFooter>
    </Card>
  )
}

export default ProjectDisplay
