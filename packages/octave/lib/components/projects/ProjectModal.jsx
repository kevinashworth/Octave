import { Components, registerComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import moment from 'moment'
import MyMarkdown from '../common/MyMarkdown'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'

const ProjectModal = (props) => {
  const { document: project, loading } = props
  if (loading) {
    return <Components.Loading />
  }
  if (!document) {
    return <FormattedMessage id='app.404' />
  }

  const displayDate =
    'Project added ' + moment(project.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
    'Last modified ' + moment(project.updatedAt).format(DATE_FORMAT_LONG)

  return (
    <div>
      <Card className='card-accent-projects'>
        <Card.Body>
          <Card.Title className='mb-1'>
            {project.projectType}
            {project.network &&
              <span>
                &bull; {project.network}
              </span>}
            &bull; {project.union}
          </Card.Title>
          <Card.Text>{project.status}</Card.Text>
          {project.summary
            ? <MyMarkdown id='projects.summary_heading' markdown={project.summary} />
            : null}
          {project.notes
            ? <MyMarkdown id='projects.notes_heading' markdown={project.notes} />
            : null}
          <hr />
          {project.website &&
            <Card.Text>
              <Card.Link href={project.website} target='_websites'>Open official website <i className='fad fa-external-link' /></Card.Link>
            </Card.Text>}
        </Card.Body>
        <Card.Body>
          <Card.Text className='mb-0'>
            <b>{project.castingCompany}</b>
          </Card.Text>
          {project.contacts &&
            project.contacts.map(contact => <Components.ContactDetail key={contact.contactId} contact={contact} />)}
          {project.addresses &&
            project.addresses.map(address => <Components.AddressDetail key={address} address={address} />)}
          {project.contactId}
        </Card.Body>
        <Card.Footer>
          <small className='text-muted'>{displayDate}</small>
        </Card.Footer>
      </Card>
    </div>
  )
}

ProjectModal.propTypes = {
  document: PropTypes.object.isRequired
}

registerComponent('ProjectModal', ProjectModal)
