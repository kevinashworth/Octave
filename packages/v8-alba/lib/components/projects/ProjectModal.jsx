import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardLink, CardText, CardTitle } from 'reactstrap'
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
          <CardBody>
            <CardTitle className='mb-1'>{ project.projectType } {project.network &&
            <span>
            &bull; { project.network }
            </span>
            } &bull; { project.union }</CardTitle>
            <CardText>{ project.status }</CardText>
            {project.htmlSummary
              ? <CardText className='mb-1' dangerouslySetInnerHTML={{ __html: project.htmlSummary }} />
              : <CardText className='mb-1'>{ project.summary }</CardText>
            }<hr />
            {project.htmlNotes
              ? <CardText className='mb-1' dangerouslySetInnerHTML={{ __html: project.htmlNotes }} />
              : <CardText className='mb-1'>{ project.notes }</CardText>
            }
            <hr />
            {project.website &&
            <CardText>
              <CardLink href={project.website} target='_websites'>Open official website <i className='fa fa-external-link' /></CardLink>
            </CardText>
            }
          </CardBody>
          <CardBody>
            <CardText className='mb-0'>
              <b>{ project.castingCompany }</b>
            </CardText>
            {project.contacts
              ? project.contacts.map(contact => <Components.ProjectsContactDetail key={contact.contactId} contact={contact} />)
              : null
            }
            {project.addresses
              ? project.addresses.map(address => <Components.ProjectsAddressDetail key={address} address={address} />)
              : null
            }
            {project.contactId}
          </CardBody>
          <CardFooter>
            <small className='text-muted'>{displayDate}</small>
          </CardFooter>
        </Card>
      </div>
    )
  }
}

ProjectModal.propTypes = {
  document: PropTypes.object.isRequired
}

registerComponent('ProjectModal', ProjectModal, withCurrentUser)
