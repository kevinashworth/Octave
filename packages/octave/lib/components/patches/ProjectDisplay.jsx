import { Components } from 'meteor/vulcan:core'
import React from 'react'
import Card from 'react-bootstrap/Card'
import MyMarkdown from '../common/MyMarkdown'
import { getFullAddress, seasonOrder } from '../../modules/helpers.js'

const ProjectDisplay = ({ project }) => {
  if (!project) return null

  const order = seasonOrder(project)
  return (
    <Card className='card-accent-projects'>
      <Card.Header as='h2'>{project.projectTitle}</Card.Header>
      <Card.Body>
        <Card.Title><b>Project Information</b></Card.Title>
        <Card.Text as='div'>
          <b>{project.projectTitle}</b><br />
          {project.projectType}{project.network && ` – ${project.network}`}<br />
          {project.union}{project.platformType && ` (${project.platformType})`}<br />
          {order}{order ? <br /> : null}
          {project.status}
        </Card.Text>
        <hr />
        {project.summary
          ? <MyMarkdown id='projects.summary_heading' markdown={project.summary} />
          : null}
        {project.notes
          ? <MyMarkdown id='projects.notes_heading' markdown={project.notes} />
          : null}
        {project.shootingLocation
          ? <MyMarkdown id='projects.shooting_heading' markdown={project.shootingLocation} />
          : null}
        <hr />
        {project.website &&
          <Card.Text>
            <Card.Link href={project.website} target='_websites'>Open official website <i className='fad fa-external-link' /></Card.Link>
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
    </Card>
  )
}

export default ProjectDisplay
