import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Markup from 'interweave'
import moment from 'moment'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { createdFormattedAddress } from '../../modules/helpers.js'

const ContactModal = (props) => {
  if (props.loading) {
    return (<div><Components.Loading /></div>)
  }

  if (!props.document) {
    return (<div><FormattedMessage id='app.404' /></div>)
  }

  const contact = props.document
  const displayDate =
      'Contact added ' + moment(contact.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(contact.updatedAt).format(DATE_FORMAT_LONG)

  return (
    <Card className='card-accent-warning'>
      <Card.Body>
        <Card.Text as='div'>
          {contact.title && <div>{contact.title}</div>}
          {contact.gender && <div>{contact.gender}</div>}
          <hr />
          {contact.htmlBody
            ? <Markup content={contact.htmlBody} />
            : <div>{contact.body}</div>}
        </Card.Text>
        {contact.addresses && contact.addresses[0] && <Card.Title>Addresses</Card.Title>}
        {contact.addresses &&
          contact.addresses.map((address, index) => (
            <Card.Text key={`address${index}`}>
              <Markup content={createdFormattedAddress(address)} />
            </Card.Text>
          ))}
        {contact.projects && contact.projects[0] && <Card.Title>Projects</Card.Title>}
        {contact.projects &&
          contact.projects.map(project => (
            <Card.Text key={project.projectId}>
              <b key={project.projectId}>
                <Link to={`/projects/${project.projectId}`}>{project.projectTitle}</Link>
              </b>
              {project.titleForProject && ` (${project.titleForProject})`}
            </Card.Text>
          ))}
      </Card.Body>
      <Card.Footer>
        <small className='text-muted'>{displayDate}</small>
      </Card.Footer>
    </Card>
  )
}

ContactModal.propTypes = {
  document: PropTypes.object.isRequired
}

registerComponent('ContactModal', ContactModal, withCurrentUser)
