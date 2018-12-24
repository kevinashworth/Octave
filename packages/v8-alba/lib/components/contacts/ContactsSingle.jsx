import { Components, registerComponent, withCurrentUser, withDocument } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router'
import mapProps from 'recompose/mapProps'
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle } from 'reactstrap'
import moment from 'moment'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { dangerouslyCreateAddress } from '../../modules/helpers.js'
import Contacts from '../../modules/contacts/collection.js'

const ContactsSingle = (props) => {
  if (props.loading) {
    return <div className='page contacts-profile'><Components.Loading /></div>
  } else if (!props.document) {
    return <div className='page contacts-profile'><FormattedMessage id='app.404' /></div>
  } else {
    const contact = props.document
    const displayDate =
      'Contact added to database ' + moment(contact.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(contact.updatedAt).format(DATE_FORMAT_LONG)

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title={`V8 Alba: ${contact.fullName}`} />
        <Card className='card-accent-warning'>
          <CardHeader tag='h2'>{ contact.fullName }{ Contacts.options.mutations.edit.check(props.currentUser, contact)
            ? <div className='float-right'>
              <Button tag={Link} to={`/contacts/${contact._id}/edit`}>Edit</Button>
            </div> : null}
          </CardHeader>
          <CardBody>
            <CardText tag='div'>
              { contact.displayName }
              { contact.title && <div>{contact.title}</div> }
              { contact.gender && <div>{contact.gender}</div> }
              <hr />
              {contact.htmlBody
                ? <div dangerouslySetInnerHTML={{ __html: contact.htmlBody }} />
                : <div>{ contact.body }</div>
              }
            </CardText>
          </CardBody>
          {contact.offices &&
          <CardBody>
            <CardTitle>Offices</CardTitle>
            {contact.offices.map((o, index) =>
              <Components.OfficeMini key={o.officeId} documentId={o.officeId} />
            )}
          </CardBody>
          }
          {contact.addresses &&
          <CardBody>
            { contact.addresses[1] && <CardTitle>Addresses</CardTitle>}
            {contact.addresses.map((address, index) =>
              <CardText key={`address${index}`} dangerouslySetInnerHTML={dangerouslyCreateAddress(address)} />
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
          {contact.pastProjects &&
          <CardBody>
            <CardTitle>Past Projects</CardTitle>
            {contact.pastProjects.map(project =>
              <CardText key={project.projectId}>
                <b><Link to={`/past-projects/${project.projectId}`}>{project.projectTitle}</Link></b>
                {project.titleForProject && ` (${project.titleForProject})`}
              </CardText>
            )}
          </CardBody>
          }
          {contact.links &&
          <CardBody>
            <CardText>
              {contact.links.map(link =>
                <Button className={`btn-${link.platformName.toLowerCase()} text-white`} key={link.profileLink}>
                  <span><CardLink href={link.profileLink} target='_links'>{link.profileName}</CardLink></span>
                </Button>)}
            </CardText>
          </CardBody>
          }
          <CardFooter>
            <small className='text-muted'>{displayDate}</small>
          </CardFooter>
        </Card>
      </div>
    )
  }
}

ContactsSingle.propTypes = {
  // document: PropTypes.object.isRequired,
}

const options = {
  collection: Contacts,
  queryName: 'contactsSingleQuery',
  fragmentName: 'ContactsSingleFragment'
}

const mapPropsFunction = props => ({ ...props, documentId: props.params._id, slug: props.params.slug })

registerComponent('ContactsSingle', ContactsSingle, withCurrentUser, mapProps(mapPropsFunction), [withDocument, options])
