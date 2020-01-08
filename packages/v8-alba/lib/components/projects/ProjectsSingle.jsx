import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import mapProps from 'recompose/mapProps'
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import Interweave from 'interweave'
import moment from 'moment'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { getFullAddress, transform } from '../../modules/helpers.js'
import Projects from '../../modules/projects/collection.js'

class ProjectsSingle extends PureComponent {
  constructor (props) {
    super(props)
    this.toggleTab = this.toggleTab.bind(this)
    this.state = { activeTab: 'Main' }
  }

  toggleTab (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab })
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
              <NavItem>
                <NavLink active={this.state.activeTab === 'History'}
                  onClick={() => { this.toggleTab('History') }}
                >History</NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId='Main'>
                <CardTitle><b>Project Information</b></CardTitle>
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
                  {project.shootingLocation &&
                    <CardText><b>Shooting Location</b>: { project.shootingLocation }</CardText>
                  }
                  <hr />
                </CardText>
              {project.website &&
              <CardText>
                <CardLink href={project.website} target='_websites'>Open official website <i className='fa fa-external-link' /></CardLink>
              </CardText>
              }
              <CardTitle className='mt-5'><b>Casting Information</b></CardTitle>
              <CardText className='mb-0'>
                <b>{ project.castingCompany }</b>
              </CardText>
              {project.castingOfficeId &&
                <Components.OfficeMini documentId={project.castingOfficeId} />
              }
              {project.contacts
                ? project.contacts.map(contact => <Components.ContactDetail key={contact.contactId} contact={contact} />)
                : null }
              {project.addresses && project.addresses[0]
                ? project.addresses.map((address, index) => <Components.ProjectsAddressDetail key={getFullAddress(address)+index} address={address} />)
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
              <TabPane tabId='History'>
                <Components.ProjectPatchesList documentId={document._id}/>
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
