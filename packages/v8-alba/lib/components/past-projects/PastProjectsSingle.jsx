import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { Component } from 'react'
import mapProps from 'recompose/mapProps'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Interweave from 'interweave'
import moment from 'moment'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { transform } from '../../modules/helpers.js'
import PastProjects from '../../modules/past-projects/collection.js'

class PastProjectsSingle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      commentsTabTitle: 'Comments'
    }
  }

  commentsCallback (labelFromCommentsThread) {
    this.setState({ commentsTabTitle: labelFromCommentsThread })
  }

  seasonorder (project) {
    if (!project.season) {
      return null
    }
    var so = `Completed Season ${project.season}`
    if (project.order) {
      so += ` (${project.order}-episode order)`
    }
    return so
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
          <Card.Header as='h2'>
            {project.projectTitle}
            {Users.canUpdate({ collection: PastProjects, user: currentUser, document }) &&
              <div className='float-right'>
                <Button variant='secondary' href={`/past-projects/${project._id}/edit`}>Edit</Button>
              </div>}
          </Card.Header>
          <Card.Body>
            <Tabs defaultActiveKey='main' id='past_projects_single_tabs'>
              <Tab eventKey='main' title='Main'>
                <Card.Text as='div'>
                  <b>{project.projectTitle}</b><br />
                  {project.projectType}{project.network && ` – ${project.network}`}<br />
                  {project.union}{project.platformType && ` (${project.platformType})`}<br />
                  {seasonorder}{seasonorder ? <br /> : null}
                  {project.status}
                  <hr />
                  {project.htmlSummary
                    ? <Interweave content={project.htmlSummary} transform={transform} />
                    : <Card.Text className='mb-1'>{project.summary}</Card.Text>}
                  {project.htmlNotes
                    ? <Interweave content={project.htmlNotes} transform={transform} />
                    : <Card.Text className='mb-1'>{project.notes}</Card.Text>}
                  {project.shootingLocation &&
                    <Card.Text><b>Shooting Location</b>: {project.shootingLocation}</Card.Text>}
                  <hr />
                </Card.Text>
                {project.website &&
                  <Card.Text>
                    <Card.Link href={project.website} target='_websites'>Open official website <i className='fa fa-external-link' /></Card.Link>
                  </Card.Text>}
                <Card.Title className='mt-5'><b>Casting Information</b></Card.Title>
                <Card.Text className='mb-0'>
                  <b>{project.castingCompany}</b>
                </Card.Text>
                {project.offices &&
                  project.offices.map(office =>
                    <div key={office.officeId}>
                      <b>{office.officeLocation}</b>
                      <Components.OfficeMini documentId={office.officeId} />
                    </div>
                  )}
                {project.contacts &&
                  project.contacts.map(contact => <Components.ContactDetail key={contact.contactId} contact={contact} />)}
                {project.addresses &&
                  project.addresses.map(address => <Components.AddressDetail key={address} address={address} />)}
                {project.links &&
                  <Card.Title className='mt-5'><b>Links</b></Card.Title>}
                {project.links &&
                  <Card.Text>
                    {project.links.map((link, index) =>
                      <Components.LinkDetail key={`link-detail-${index}`} link={link} />
                    )}
                  </Card.Text>}
              </Tab>
              <Tab eventKey='comments' title={this.state.commentsTabTitle}>
                <Components.CommentsThread
                  callbackFromSingle={this.commentsCallback}
                  terms={{ objectId: document._id, collectionName: 'Projects', view: 'Comments' }}
                />
              </Tab>
              <Tab eventKey='history' title='History'>
                <Components.PastProjectPatchesList documentId={document._id} />
              </Tab>
            </Tabs>
          </Card.Body>
          <Card.Footer>
            <small className='text-muted'>{displayDate}</small>
          </Card.Footer>
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
