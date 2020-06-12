import { Components } from 'meteor/vulcan:core'
import React from 'react'
import Card from 'react-bootstrap/Card'
import Interweave from 'interweave'
import moment from 'moment'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import { getFullAddress, transformLinks } from '../../modules/helpers.js'

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
    if (project.status === 'Casting' || project.status === 'See Notes' || project.status === 'Pre-Prod.') {
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
      <Card.Header as='h2'>{project.projectTitle}</Card.Header>
      <Card.Body>
        <Card.Title><b>Project Information</b></Card.Title>
        <Card.Text as='div'>
          <b>{project.projectTitle}</b><br />
          {project.projectType}{project.network && ` – ${project.network}`}<br />
          {project.union}{project.platformType && ` (${project.platformType})`}<br />
          {seasonorder(project)}
          {project.status}
        </Card.Text>
        <hr />
        {project.htmlSummary
          ? <Interweave content={project.htmlSummary} transform={transformLinks} />
          : <Card.Text>{project.summary}</Card.Text>}
        {project.htmlNotes
          ? <Interweave content={project.htmlNotes} transform={transformLinks} />
          : <Card.Text>{project.notes}</Card.Text>}
        {project.shootingLocation &&
          <Card.Text><b>Shooting Location</b>: {project.shootingLocation}</Card.Text>}
        <hr />
        {project.website &&
          <Card.Text>
            <Card.Link href={project.website} target='_websites'>Open official website <i className='fa fa-external-link' /></Card.Link>
          </Card.Text>}
        <Card.Title className='mt-5'><b>Casting Information</b></Card.Title>
        <Card.Text className='mb-0'>
          <b>{project.castingCompany}</b>
        </Card.Text>
        {project.offices &&
          project.offices.map(office =>
            <div key={office.officeId}>
              <b>{office.officeLocation}</b>
              <Components.OfficeMini documentId={office.officeId} />
            </div>
          )}
        {project.contacts &&
          project.contacts.map(contact => <Components.ContactDetail key={contact.contactId} contact={contact} />)}
        {project.addresses && project.addresses[0] &&
          project.addresses.map((address, index) => <Components.AddressDetail key={getFullAddress(address) + index} address={address} />)}
        {project.contactId}
        {project.links &&
          <Card.Title className='mt-5'><b>Links</b></Card.Title>}
        {project.links &&
          <Card.Text>
            {project.links.map((link, index) =>
              <Components.LinkDetail key={`link-detail-${index}`} link={link} />
            )}
          </Card.Text>}
      </Card.Body>
      <Card.Footer>
        <span className='text-muted'>{displayDate}</span>
      </Card.Footer>
    </Card>
  )
}

export default ProjectDisplay
