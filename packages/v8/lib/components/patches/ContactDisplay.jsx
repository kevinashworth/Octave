import { Components } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Interweave from 'interweave'
import moment from 'moment'
import pluralize from 'pluralize'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import { isEmptyValue, transformLinks } from '../../modules/helpers.js'

const PastProjects = (props) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Past Projects</Card.Title>
        {props.pastProjects.map((o, index) => <Components.PastProjectMini key={`PastProjectMini${index}`} documentId={o.projectId} />)}
      </Card.Body>
    </Card>
  )
}

const ContactDisplay = ({ contact }) => {
  const displayDate =
    'Contact as it was in the database before it was edited ' + moment(contact.updatedAt).format(DATE_FORMAT_LONG)
  return (
    <>
      <Card className='card-accent-warning'>
        <Card.Header as='h2'>{contact.fullName}</Card.Header>
        <Card.Body>
          <Card.Text as='div'>
            <b>{contact.displayName}</b>
            {contact.title && <div>{contact.title}</div>}
            {contact.gender && <div>{contact.gender}</div>}
            <hr />
            {contact.htmlBody
              ? <Interweave content={contact.htmlBody} transform={transformLinks} />
              : <div>{contact.body}</div>}
          </Card.Text>
          {!isEmptyValue(contact.offices) &&
            <Card.Title className='mt-5'><b>{pluralize('Office', contact.offices.length)}</b></Card.Title>}
          {!isEmptyValue(contact.offices) &&
            contact.offices.map((o, index) =>
              <Components.OfficeMini key={index} documentId={o.officeId} />
            )}
          {contact.addresses &&
            contact.addresses[0] && <Card.Title className='mt-5'><b>{pluralize('Address', contact.addresses.length)}</b></Card.Title>}
          {contact.addresses &&
            contact.addresses.map((address, index) =>
              <Components.AddressDetail key={`address${index}`} address={address} />
            )}
          {!isEmptyValue(contact.projects) &&
            <Card.Title className='mt-5'><b>Projects</b></Card.Title>}
          {!isEmptyValue(contact.projects) &&
            contact.projects.map(project =>
              <Card.Text key={project.projectId}>
                <b><Link to={`/projects/${project.projectId}`}>{project.projectTitle}</Link></b>
                {project.titleForProject && ` (${project.titleForProject})`}
              </Card.Text>
            )}
          {contact.links &&
            <Card.Title className='mt-5'><b>Links</b></Card.Title>}
          {contact.links &&
            <Card.Text>
              {contact.links.map((link, index) =>
                <Components.LinkDetail key={`link-detail-${index}`} link={link} />
              )}
            </Card.Text>}
        </Card.Body>
        <Card.Footer>
          <span className='text-muted'>{displayDate}</span>
        </Card.Footer>
      </Card>
      {contact.pastProjects &&
        <div>
          <PastProjects pastProjects={contact.pastProjects} />
        </div>}
    </>
  )
}

export default ContactDisplay
