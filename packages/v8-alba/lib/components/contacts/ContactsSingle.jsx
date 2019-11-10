import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import mapProps from 'recompose/mapProps'
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle, Col, Collapse, Row } from 'reactstrap'
import Markup from 'interweave'
import moment from 'moment'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { dangerouslyCreateAddress, isEmptyValue } from '../../modules/helpers.js'
import Contacts from '../../modules/contacts/collection.js'

class ContactsSingle extends PureComponent {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = { collapse: false }
  }

  toggle () {
    this.setState({ collapse: !this.state.collapse })
  }

  render () {
    const { currentUser, document, loading } = this.props
    if (loading) {
      return <div className='page contacts-profile'><Components.Loading /></div>
    } else if (!document) {
      return <div className='page contacts-profile'><FormattedMessage id='app.404' /></div>
    } else {
      const contact = document
      const displayDate =
        'Contact added to database ' + moment(contact.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
        'Last modified ' + moment(contact.updatedAt).format(DATE_FORMAT_LONG)

      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title={`V8 Alba: ${contact.fullName}`} />
          <Card className='card-accent-warning'>
            <CardHeader tag='h2'>{ contact.fullName }{ Contacts.options.mutations.edit.check(currentUser, contact)
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
                  ? <Markup content={contact.htmlBody} />
                  : <div>{ contact.body }</div>
                }
              </CardText>
            </CardBody>
            <Row>
              <Col xs='12' lg='6'>
                {!isEmptyValue(contact.offices) &&
                <CardBody>
                  <CardTitle>Offices</CardTitle>
                  {contact.offices.map((o, index) =>
                    <Components.OfficeMini key={index} documentId={o.officeId} />
                  )}
                </CardBody>
                }
                {contact.addresses &&
                <CardBody>
                  {contact.addresses[0] && <CardTitle>Addresses</CardTitle>}
                  {contact.addresses.map((address, index) =>
                    <Markup key={`address${index}`} content={dangerouslyCreateAddress(address).__html} />
                  )}
                </CardBody>
                }
                {!isEmptyValue(contact.projects) &&
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
              </Col>
              <Col xs='12' lg='6'>
                <CardBody>
                  <Components.CommentsThread
                    terms={{ objectId: document._id, collectionName: 'Contacts', view: 'Comments' }}
                  />
              </CardBody>
              </Col>
            </Row>
            <CardFooter>
              <small className='text-muted'>{displayDate}</small>
            </CardFooter>
          </Card>
          {contact.pastProjects &&
          <div>
            <Button color='link' onClick={this.toggle}
              style={{ marginBottom: '1rem' }}>{`${this.state.collapse ? 'Hide' : 'Show'} Past Projects`}</Button>
            <Collapse isOpen={this.state.collapse}>
              <Card>
                <CardBody>
                  <CardTitle>Past Projects</CardTitle>
                  {contact.pastProjects.map(project =>
                    <CardText key={project.projectId}>
                      <b><Link to={`/past-projects/${project.projectId}`}>{project.projectTitle}</Link></b>
                      {project.titleForProject && ` (${project.titleForProject})`}
                    </CardText>
                  )}
                </CardBody>
              </Card>
            </Collapse>
          </div>
          }
        </div>
      )
    }
  }
}

ContactsSingle.propTypes = {
  documentId: PropTypes.string,
  document: PropTypes.object
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment'
}

const mapPropsFunction = props => ({ ...props, documentId: props.match && props.match.params._id })

registerComponent({
  name: 'ContactsSingle',
  component: ContactsSingle,
  hocs: [
    withCurrentUser,
    mapProps(mapPropsFunction), [withSingle, options] // mapProps must precede withSingle
  ]
})
