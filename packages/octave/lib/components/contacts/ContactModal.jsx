import { Components, registerComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import moment from 'moment'
import MyMarkdown from '../common/MyMarkdown'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'

const ContactModal = (props) => {
  const { document: contact, loading } = props
  if (loading) {
    return <Components.Loading />
  }
  if (!document) {
    return <FormattedMessage id='app.404' />
  }

  const displayDate =
      'Contact added ' + moment(contact.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(contact.updatedAt).format(DATE_FORMAT_LONG)

  return (
    <Card className='card-accent-contacts'>
      <Card.Body>
        <Card.Text as='div'>
          {contact.title && <div>{contact.title}</div>}
          {contact.gender && <div>{contact.gender}</div>}
          <hr />
          {contact.body
            ? <MyMarkdown markdown={contact.body} />
            : null}
        </Card.Text>
        {contact.addresses &&
          contact.addresses[0] && <Card.Title>Addresses</Card.Title>}
        {contact.addresses &&
          contact.addresses.map(address => <Components.AddressDetail key={address} address={address} />)}
        {contact.projects &&
          contact.projects[0] && <Card.Title>Projects</Card.Title>}
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

registerComponent('ContactModal', ContactModal)
