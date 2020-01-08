import { Components } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardHeader, CardText, CardTitle } from 'reactstrap'
import Interweave from 'interweave'
import moment from 'moment'
import pluralize from 'pluralize'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import { createdFormattedAddress, isEmptyValue, transform } from '../../modules/helpers.js'

function PastProjects (props) {
  return (
    <Card>
      <CardBody>
        <CardTitle>Past Projects</CardTitle>
        {props.pastProjects.map((o, index) => <Components.PastProjectMini key={`PastProjectMini${index}`} documentId={o.projectId} />)}
      </CardBody>
    </Card>
  )
}

const ContactDisplay = ({ contact }) => {
  const displayDate =
    'Contact as it was in the database before it was edited ' + moment(contact.updatedAt).format(DATE_FORMAT_LONG)
    return (
      <>
    <Card className='card-accent-warning'>
      <CardHeader tag='h2'>{ contact.fullName }</CardHeader>
      <CardBody>
        <CardText tag='div'>
          <b>{ contact.displayName }</b>
          { contact.title && <div>{contact.title}</div> }
          { contact.gender && <div>{contact.gender}</div> }
          <hr />
          {contact.htmlBody
            ? <Interweave content={contact.htmlBody} transform={transform} />
            : <div>{ contact.body }</div>
          }
        </CardText>
        {!isEmptyValue(contact.offices) &&
          <CardTitle className='mt-5'><b>{pluralize('Office', contact.offices.length)}</b></CardTitle>}
        {!isEmptyValue(contact.offices) &&
          contact.offices.map((o, index) =>
            <Components.OfficeMini key={index} documentId={o.officeId} />
          )}
        {contact.addresses &&
          contact.addresses[0] && <CardTitle className='mt-5'><b>{pluralize('Address', contact.addresses.length)}</b></CardTitle>}
        {contact.addresses &&
          contact.addresses.map((address, index) =>
            <Interweave key={`address${index}`} content={createdFormattedAddress(address)} />
          )}
        {!isEmptyValue(contact.projects) &&
          <CardTitle className='mt-5'><b>Projects</b></CardTitle>}
        {!isEmptyValue(contact.projects) &&
          contact.projects.map(project =>
            <CardText key={project.projectId}>
              <b><Link to={`/projects/${project.projectId}`}>{project.projectTitle}</Link></b>
              {project.titleForProject && ` (${project.titleForProject})`}
            </CardText>
          )}
        {contact.links &&
          <CardTitle className='mt-5'><b>Links</b></CardTitle>}
        {contact.links &&
          <CardText>
            {contact.links.map((link, index) =>
              <Components.LinkDetail key={`link-detail-${index}`} link={link} />
            )}
          </CardText>
        }
      </CardBody>
      <CardFooter>
        <span className='text-muted'>{displayDate}</span>
      </CardFooter>
    </Card>
    {contact.pastProjects &&
    <div>
        <PastProjects pastProjects={contact.pastProjects} />
    </div>
    }
    </>
  )
}

export default ContactDisplay
