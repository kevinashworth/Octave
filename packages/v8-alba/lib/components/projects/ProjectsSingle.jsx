import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import mapProps from 'recompose/mapProps'
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardSubtitle, CardText, CardTitle, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import Interweave from 'interweave'
import moment from 'moment'
import pluralize from 'pluralize'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { transform } from '../../modules/helpers.js'
import Projects from '../../modules/projects/collection.js'

class ProjectsSingle extends PureComponent {
  constructor (props) {
    super(props)
    this.toggleTab = this.toggleTab.bind(this)
    this.state = {
      activeTab: 'Main',
      collapseIsOpen: false
    }
  }

  toggleTab (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  seasonorder (project) {
    if (!project.season) {
      return null
    }

    var so = 'Season Info Missing'
    if (project.renewed && project.status === 'On Hiatus' || project.status === 'Ordered') {
      so = `Renewed for Season ${project.season}`
    } else if (project.status === 'On Hiatus' || project.status === 'Wrapped' || project.status === 'Canceled') {
      so = `Completed Season ${project.season}`
    }
    if (project.status === 'Casting' || project.status === 'See Notes') {
      so = `Season ${project.season}`
    }
    if (project.order) {
      so += ` (${project.order}-episode order)`
    }
    return so
  }

  render () {
    const { currentUser, document, networkStatus } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return (<div><Components.Loading /></div>)
    }
    if (!document) {
      return (<div><FormattedMessage id='app.404' /></div>)
    }
    const project = document
    const seasonorder = this.seasonorder(project)
    const displayDate =
      'Project added to database ' + moment(project.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(project.updatedAt).format(DATE_FORMAT_LONG)

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title={`V8 Alba: ${project.projectTitle}`} />
        <Card className='card-accent-danger'>
          <CardHeader tag='h2'>
            { project.projectTitle }
            { Users.canUpdate({ collection: Projects, user: currentUser, document })
              ? <div className='float-right'>
                  <Button tag={Link} to={`/projects/${project._id}/edit`}>Edit</Button>
                </div>
              : null }
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
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId='Main'>
                <CardTitle><b>Infomation</b></CardTitle>
                <CardText tag='div'>
                  <b>{ project.projectTitle }</b><br />
                  { project.projectType }{ project.network && ` – ${project.network}` }<br />
                  { project.union }{ project.platformType && ` (${project.platformType})` }<br />
                  { seasonorder }{ seasonorder ? <br /> : null }
                  { project.status }
                  <hr />
                  {project.htmlSummary
                    ? <Interweave content={project.htmlSummary} transform={transform} />
                    : <CardText>{ project.summary }</CardText>
                  }
                  {project.htmlNotes
                    ? <Interweave content={project.htmlNotes} transform={transform} />
                    : <CardText>{ project.notes }</CardText>
                  }
                  <hr />
                </CardText>
              {project.website &&
              <CardText>
                <CardLink href={project.website} target='_websites'>Open official website <i className='fa fa-external-link' /></CardLink>
              </CardText>
              }
              {(project.castingCompany || project.castingOfficeId) &&
                <CardTitle className='mt-5'><b>Office</b></CardTitle>}
              <CardText className='mb-0'>
                <b>{ project.castingCompany }</b>
              </CardText>
              {project.castingOfficeId &&
                <Components.OfficeMini documentId={project.castingOfficeId} />
              }
              {project.contacts &&
                <CardTitle className='mt-5'><b>Contacts</b></CardTitle>}
              {project.contacts
                ? project.contacts.map(contact => <Components.ContactDetail key={contact.contactId} contact={contact} />)
                : null }
              {project.addresses &&
                project.addresses[0] && <CardTitle className='mt-5'><b>{pluralize('Address', project.addresses.length)}</b></CardTitle>}
              {project.addresses
                ? project.addresses.map(address => <Components.ProjectsAddressDetail key={address} address={address} />)
                : null }
              {project.contactId}
              {project.links &&
                <CardTitle className='mt-5'><b>Links</b></CardTitle>}
              {project.links &&
                <CardText>
                  {project.links.map((link, index) =>
                    <Components.LinkDetail key={`link-detail-${index}`} link={link} />
                  )}
                </CardText>
              }
              </TabPane>
              <TabPane tabId='Comments'>
                <Components.CommentsThread
                  terms={{ objectId: document._id, collectionName: 'Projects', view: 'Comments' }}
                />
              </TabPane>
            </TabContent>
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
  fragmentName: 'ProjectsSingleFragment'
}

const mapPropsFunction = props => ({ ...props, documentId: props.match && props.match.params._id })

registerComponent({
  name: 'ProjectsSingle',
  component: ProjectsSingle,
  hocs: [
    withCurrentUser,
    mapProps(mapPropsFunction), [withSingle, options] // mapProps must precede withSingle
  ]
})
