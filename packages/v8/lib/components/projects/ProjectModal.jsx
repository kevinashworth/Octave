import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Markup from 'interweave'
import moment from 'moment'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'

class ProjectModal extends PureComponent {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    if (!this.props.document) {
      return (<div><FormattedMessage id='app.404' /></div>)
    }

    const project = this.props.document
    const displayDate =
      'Project added ' + moment(project.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(project.updatedAt).format(DATE_FORMAT_LONG)

    return (
      <div>
        <Card className='card-accent-danger'>
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
            {project.htmlSummary
              ? <Markup content={project.htmlSummary} />
              : <Card.Text className='mb-1'>{project.summary}</Card.Text>}
            <hr />
            {project.htmlNotes
              ? <Markup content={project.htmlNotes} />
              : <Card.Text className='mb-1'>{project.notes}</Card.Text>}
            <hr />
            {project.website &&
              <Card.Text>
                <Card.Link href={project.website} target='_websites'>Open official website <i className='fa fa-external-link' /></Card.Link>
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
}

ProjectModal.propTypes = {
  document: PropTypes.object.isRequired
}

registerComponent('ProjectModal', ProjectModal, withCurrentUser)
