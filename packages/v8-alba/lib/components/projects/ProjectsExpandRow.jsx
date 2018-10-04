import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle } from 'reactstrap'
import moment from 'moment'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'

class ProjectsExpandRow extends PureComponent {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    if (!this.props.document) {
      return (<div><Components.FormattedMessage id='app.404' /></div>)
    }

    const project = this.props.document
    const displayDate =
      'Project added to database ' + moment(project.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(project.updatedAt).format(DATE_FORMAT_LONG)

    return (
      <div className='animated fadeIn'>
        <Card className='card-accent-danger'>
          <CardHeader tag='h2'>{ project.projectTitle }</CardHeader>
          <CardBody>
            <CardTitle className='mb-1'>{ project.projectType } {project.network &&
            <span>
            &bull; { project.network }
            </span>
            } &bull; { project.union }</CardTitle>
            <CardText>{ project.status }</CardText>
            <CardText className='mb-1'>{ project.logline }</CardText>
            <hr />
            <CardText className='mb-1'>{ project.notes }</CardText>
            <hr />
            {project.website &&
            <CardText>
              <CardLink href={project.website}>Open official website <i className='fa fa-external-link' /></CardLink>
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

registerComponent('ProjectsExpandRow', ProjectsExpandRow, withCurrentUser)
