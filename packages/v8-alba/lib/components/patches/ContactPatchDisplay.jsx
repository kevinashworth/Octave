import { Components, registerComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardHeader, CardText, CardTitle } from 'reactstrap'
import Interweave from 'interweave'
import moment from 'moment'
import pluralize from 'pluralize'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import { createdFormattedAddress, isEmptyValue, transform } from '../../modules/helpers.js'

const ContactPatchDisplay = (props) => {
  if (props.loading) {
    return <Components.Loading />
  }
  if (!props.document) {
    return <FormattedMessage id='app.404' />
  }

  const contact = props.document
  const displayDate =
    'Contact before edited at ' + moment(contact.updatedAt).format(DATE_FORMAT_LONG)
  return (
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
        <small className='text-muted'>{displayDate}</small>
      </CardFooter>
    </Card>
  )
}

ContactPatchDisplay.propTypes = {
  document: PropTypes.object.isRequired
}

registerComponent({
  name: 'ContactPatchDisplay',
  component: ContactPatchDisplay
})
