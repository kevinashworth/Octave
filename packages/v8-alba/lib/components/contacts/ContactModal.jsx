import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardText, CardTitle } from 'reactstrap'
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
    <div>
      <Card className='card-accent-warning'>
        <CardBody>
          <CardText tag='div'>
            { contact.title && <div>{contact.title}</div> }
            { contact.gender && <div>{contact.gender}</div> }
            <hr />
            {contact.htmlBody
              ? <Markup content={contact.htmlBody} />
              : <div>{ contact.body }</div>
            }
          </CardText>
        </CardBody>
        {contact.addresses &&
        <CardBody>
          { contact.addresses[0] && <CardTitle>Addresses</CardTitle>}
          {contact.addresses.map((address, index) =>
            <Markup key={`address${index}`} content={createdFormattedAddress(address)} />
          )}
        </CardBody>
        }
        {contact.projects &&
        <CardBody>
          <CardTitle>Projects</CardTitle>
          {contact.projects.map(project =>
            <CardText key={project.projectId}>
              <b><Link to={`/projects/${project.projectId}`}>{project.projectTitle}</Link></b>
              {project.titleForProject && ` (${project.titleForProject})`}
            </CardText>
          )}
        </CardBody>
        }
        <CardFooter>
          <small className='text-muted'>{displayDate}</small>
        </CardFooter>
      </Card>
    </div>
  )
}

ContactModal.propTypes = {
  document: PropTypes.object.isRequired
}

registerComponent('ContactModal', ContactModal, withCurrentUser)
