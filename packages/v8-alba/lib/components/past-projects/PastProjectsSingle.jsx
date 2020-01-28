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
import { transform } from '../../modules/helpers.js'
import PastProjects from '../../modules/past-projects/collection.js'

class PastProjectsSingle extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      activeTab: 'Main',
      commentsTabLabel: 'Comments'
    }

    this.commentsCallback = this.commentsCallback.bind(this)
    this.toggleTab = this.toggleTab.bind(this)
  }

  commentsCallback (labelFromCommentsThread) {
    this.setState({ commentsTabLabel: labelFromCommentsThread })
  }

  seasonorder (project) {
    if (!project.season) {
      return null
    }
    var so = 'Season Info Missing'
    if (project.renewed && project.status === 'On Hiatus') {
      so = `Renewed for Season ${project.season}`
    } else if (project.status === 'On Hiatus' || project.status === 'Wrapped' || project.status === 'Canceled') {
      so = `Completed Season ${project.season}`
    }
    if (project.status === 'Casting') {
      so = `Season ${project.season}`
    }
    if (project.order) {
      so += ` (${project.order}-episode order)`
    }
    return so
  }

  toggleTab (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab })
    }
  }

  render () {
    const { currentUser, document, networkStatus } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return <Components.Loading />
    }
    if (!document) {
      return <FormattedMessage id='app.404' />
    }
    const project = document
    const seasonorder = this.seasonorder(project)
    const displayDate =
      'Project first added to database ' + moment(project.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(project.updatedAt).format(DATE_FORMAT_LONG)

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title={`V8 Alba: ${project.projectTitle}`} />
        <Card className='card-accent-secondary'>
          <CardHeader tag='h2'>{ project.projectTitle }{ Users.canUpdate({ collection: PastProjects, user: currentUser, document })
            ? <div className='float-right'>
              <Button tag={Link} to={`/past-projects/${project._id}/edit`}>Edit</Button>
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
              >{ this.state.commentsTabLabel }</NavLink>
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
              <b>{ project.projectTitle }</b><br />
              { project.projectType }{ project.network && ` – ${project.network}` }<br />
              { project.union }{ project.platformType && ` (${project.platformType})` }<br />
              { seasonorder }{ seasonorder ? <br /> : null }
              { project.status }
              <hr />
              {project.htmlSummary
                ? <Interweave content={project.htmlSummary} transform={transform} />
                : <CardText className='mb-1'>{ project.summary }</CardText>
              }
              {project.htmlNotes
                ? <Interweave content={project.htmlNotes} transform={transform} />
                : <CardText className='mb-1'>{ project.notes }</CardText>
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
              <b>{project.castingCompany}</b>
            </CardText>
            {project.offices &&
              project.offices.map(office =>
                <div key={office.officeId}>
                  <b>{office.officeLocation}</b>
                  <Components.OfficeMini documentId={office.officeId} />
                </div>
              )
            }
            {project.contacts
              ? project.contacts.map(contact => <Components.ContactDetail key={contact.contactId} contact={contact} />)
              : null
            }
            {project.addresses
              ? project.addresses.map(address => <Components.AddressDetail key={address} address={address} />)
              : null
            }
            {project.links &&
              <CardTitle className='mt-5'><b>Links</b></CardTitle>}
            {project.links &&
              <CardText>
                {project.links.map((link, index) =>
                  <Components.LinkDetail key={`link-detail-${index}`} link={link} />
                )}
              </CardText>}
            </TabPane>
            <TabPane tabId='Comments'>
              <Components.CommentsThread callbackFromSingle={this.commentsCallback}
                terms={{ objectId: document._id, collectionName: 'Projects', view: 'Comments' }}
              />
            </TabPane>
            <TabPane tabId='History'>
              <Components.PastProjectPatchesList documentId={document._id} />
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
  collection: PastProjects,
  fragmentName: 'PastProjectsSingleFragment'
}

const mapPropsFunction = props => ({ ...props, documentId: props.match && props.match.params._id, slug: props.match && props.match.params.slug })

registerComponent({
  name: 'PastProjectsSingle',
  component: PastProjectsSingle,
  hocs: [
    withCurrentUser,
    mapProps(mapPropsFunction), [withSingle, options] // mapProps must precede withSingle
  ]
})
