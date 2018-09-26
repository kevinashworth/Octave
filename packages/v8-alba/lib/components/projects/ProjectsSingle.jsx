import { Components, registerComponent, withCurrentUser, withDocument } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import mapProps from 'recompose/mapProps'
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle } from 'reactstrap'
import moment from 'moment'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import Projects from '../../modules/projects/collection.js'

class ProjectsSingle extends PureComponent {
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
        <Components.HeadTags title={`V8 Alba: ${project.projectTitle}`} />
        <Card className='card-accent-danger'>
          <CardHeader tag='h2'>{ project.projectTitle }{ Projects.options.mutations.edit.check(this.props.currentUser, project)
            ? <div className='float-right'>
              <Button tag={Link} to={`/projects/${project._id}/edit`}>Edit</Button>
            </div> : null}
          </CardHeader>

          <CardBody>
            <CardTitle className='mb-1'>{ project.projectType } {project.network &&
            <span>
            &bull; { project.network }
            </span>
            } &bull; { project.union }</CardTitle>
            <CardText>{ project.status }</CardText>
            {project.htmlLogline
              ? <CardText className='mb-1' dangerouslySetInnerHTML={{ __html: project.htmlLogline }} />
              : <CardText className='mb-1'>{ project.logline }</CardText>
            }
            <hr />
            {project.htmlNotes
              ? <CardText className='mb-1' dangerouslySetInnerHTML={{ __html: project.htmlNotes }} />
              : <CardText className='mb-1'>{ project.notes }</CardText>
            }
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
              : <CardText>No contacts yet. ADD ONE!</CardText>
            }
            {project.addresses
              ? project.addresses.map(address => <Components.ProjectsAddressDetail key={address} address={address} />)
              : <CardText>No addresses yet. ADD ONE!</CardText>
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

const options = {
  collection: Projects,
  queryName: 'projectsSingleQuery',
  fragmentName: 'ProjectsSingleFragment'
}

const mapPropsFunction = props => ({ ...props, documentId: props.params._id, slug: props.params.slug })

registerComponent('ProjectsSingle', ProjectsSingle, withCurrentUser, mapProps(mapPropsFunction), [withDocument, options])
