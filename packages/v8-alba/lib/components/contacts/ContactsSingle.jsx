import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import mapProps from 'recompose/mapProps'
import { Button, Card, CardBody, CardFooter, CardHeader, CardText, CardTitle, Collapse, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import Interweave from 'interweave'
import moment from 'moment'
import pluralize from 'pluralize'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { createdFormattedAddress, isEmptyValue, transform } from '../../modules/helpers.js'
import Contacts from '../../modules/contacts/collection.js'

// Don't fetch and render PastProjects unless user clicks to see them
// See https://reactjs.org/docs/conditional-rendering.html
function PastProjects (props) {
  if (!props.collapseIsOpen) {
    return null
  }

  return (
    <Card>
      <CardBody>
        <CardTitle>Past Projects</CardTitle>
        {props.pastProjects.map((o, index) => <Components.PastProjectMini key={`PastProjectMini${index}`} documentId={o.projectId} />)}
      </CardBody>
    </Card>
  )
}

class ContactsSingle extends PureComponent {
  constructor (props) {
    super(props)
    this.toggleCollapse = this.toggleCollapse.bind(this)
    this.toggleTab = this.toggleTab.bind(this)
    this.state = {
      activeTab: 'Main',
      collapseIsOpen: false
    }
  }

  toggleCollapse () {
    this.setState({ collapseIsOpen: !this.state.collapseIsOpen })
  }

  toggleTab (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  render () {
    const { currentUser, document, networkStatus } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return <Components.Loading />
    } else if (!document) {
      return <FormattedMessage id='app.404' />
    } else {
      const contact = document
      const displayDate =
        'Contact added to database ' + moment(contact.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
        'Last modified ' + moment(contact.updatedAt).format(DATE_FORMAT_LONG)

      return (
        <div className='animated fadeIn'>
          <Components.HeadTags title={`V8 Alba: ${contact.fullName}`} />
          <Card className='card-accent-warning'>
            <CardHeader tag='h2'>{ contact.fullName }{ Users.canUpdate({ collection: Contacts, user: currentUser, document })
              ? <div className='float-right'>
                <Button tag={Link} to={`/contacts/${contact._id}/edit`}>Edit</Button>
              </div> : null}
            </CardHeader>
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink active={this.state.activeTab === 'Main'}
                    onClick={() => { this.toggleTab('Main') }}
                  >Main</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={this.state.activeTab === 'Comments'}
                    onClick={() => { this.toggleTab('Comments') }}
                  >Comments</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={this.state.activeTab === 'History'}
                    onClick={() => { this.toggleTab('History') }}
                  >History</NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId='Main'>
                  <CardText tag='div'>
                    <b>{ contact.displayName }</b>
                    { contact.title && <div>{contact.title}</div> }
                    { contact.gender && <div>{contact.gender}</div> }
                    <hr />
                    {contact.htmlBody
                      ? <Interweave content={contact.htmlBody} transform={transform} />
                      : <div>{ contact.body }</div>
                    }
                  </CardText>
                  {!isEmptyValue(contact.offices) &&
                    <CardTitle className='mt-5'><b>{pluralize('Office', contact.offices.length)}</b></CardTitle>}
                  {!isEmptyValue(contact.offices) &&
                    contact.offices.map((o, index) =>
                      <Components.OfficeMini key={index} documentId={o.officeId} />
                    )}
                  {contact.addresses &&
                    contact.addresses[0] && <CardTitle className='mt-5'><b>{pluralize('Address', contact.addresses.length)}</b></CardTitle>}
                  {contact.addresses &&
                    contact.addresses.map((address, index) =>
                      <Interweave key={`address${index}`} content={createdFormattedAddress(address)} />
                    )}
                  {!isEmptyValue(contact.projects) &&
                    <CardTitle className='mt-5'><b>Projects</b></CardTitle>}
                  {!isEmptyValue(contact.projects) &&
                    contact.projects.map(project =>
                      <CardText key={project.projectId}>
                        <b><Link to={`/projects/${project.projectId}`}>{project.projectTitle}</Link></b>
                        {project.titleForProject && ` (${project.titleForProject})`}
                      </CardText>
                    )}
                  {contact.links &&
                    <CardTitle className='mt-5'><b>Links</b></CardTitle>}
                  {contact.links &&
                    <CardText>
                      {contact.links.map((link, index) =>
                        <Components.LinkDetail key={`link-detail-${index}`} link={link} />
                      )}
                    </CardText>
                  }
                </TabPane>
                <TabPane tabId='Comments'>
                  <Components.CommentsThread
                    terms={{ objectId: document._id, collectionName: 'Contacts', view: 'Comments' }}
                  />
                </TabPane>
                <TabPane tabId='History'>
                  <Components.ContactPatchesList documentId={document._id}/>
                </TabPane>
              </TabContent>
            </CardBody>
            <CardFooter>
              <small className='text-muted'>{displayDate}</small>
            </CardFooter>
          </Card>
          {contact.pastProjects &&
          <div>
            <Button color='link' onClick={this.toggleCollapse}
              className='mb-3'>{`${this.state.collapseIsOpen ? 'Hide' : 'Show'} Past Projects`}</Button>
            <Collapse isOpen={this.state.collapseIsOpen}>
              <PastProjects collapseIsOpen={this.state.collapseIsOpen} pastProjects={contact.pastProjects} />
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
