import { Components, registerComponent, withCurrentUser, withSingle2 } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Interweave from 'interweave'
import get from 'lodash/get'
import moment from 'moment'
import mapProps from 'recompose/mapProps'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { getFullAddress, transformLinks } from '../../modules/helpers.js'
import Projects from '../../modules/projects/collection.js'

class ProjectsSingle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      commentsTabTitle: 'Comments'
    }
  }

  commentsCallback = (labelFromCommentsThread) => {
    this.setState({ commentsTabTitle: labelFromCommentsThread })
  }

  deleteAlgoliaRecord = (documentId) => {
    if (typeof documentId === 'string') {
      Meteor.call(
        'deleteAlgoliaRecord',
        documentId,
        (error, result) => { // we expect result to be undefined
          if (error) {
            console.error('deleteAlgoliaRecord error:', error)
          }
        })
    }
  }

  seasonorder (project) {
    if (!project.season) {
      return null
    }
    var so = 'Season Info Missing'
    if (project.renewed && (project.status === 'On Hiatus' || project.status === 'Ordered')) {
      so = `Renewed for Season ${project.season}`
    } else if (project.status === 'On Hiatus' || project.status === 'Wrapped' || project.status === 'Canceled') {
      so = `Completed Season ${project.season}`
    }
    if (project.status === 'Casting' || project.status === 'Pre-Prod.' || project.status === 'See Notes' || project.status === 'Suspended' || project.status === 'Undetermined') {
      so = `Season ${project.season}`
    }
    if (project.order) {
      so += ` (${project.order}-episode order)`
    }
    return so
  }

  render () {
    const { currentUser, document, documentId, loading } = this.props
    if (loading) {
      return (<div><Components.Loading /></div>)
    }
    if (!document) {
      return (
        <Card>
          <Card.Body>
            <Card.Text>
              <FormattedMessage id='app.missing_document' />
            </Card.Text>
            {Users.isAdmin(currentUser) &&
              <Card.Text>
                <Button variant='projects' onClick={this.deleteAlgoliaRecord(documentId)}>Admin: Delete {documentId} from Algolia</Button>{' '}
                <Link to={`/past-projects/${documentId}`}>Is this _id for a Past Project?</Link>
              </Card.Text>}
          </Card.Body>
        </Card>
      )
    }

    const project = document
    const seasonorder = this.seasonorder(project)
    const displayDate =
      'Project added to database ' + moment(project.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(project.updatedAt).format(DATE_FORMAT_LONG)

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title={`V8: ${project.projectTitle}`} />
        <Card className='card-accent-projects'>
          <Card.Header as='h2'>
            {project.projectTitle}
            {Users.canUpdate({ collection: Projects, user: currentUser, document }) &&
              <div className='float-right'>
                <LinkContainer to={`/projects/${project._id}/edit`}>
                  <Button variant='secondary'>Edit</Button>
                </LinkContainer>
              </div>}
          </Card.Header>
          <Card.Body>
            <Tabs defaultActiveKey='main' id='projects_single_tabs'>
              <Tab eventKey='main' title='Main'>
                <Card.Title><b>Project Information</b></Card.Title>
                <Card.Text as='div'>
                  <b>{project.projectTitle}</b><br />
                  {project.projectType}{project.network && ` – ${project.network}`}<br />
                  {project.union}{project.platformType && ` (${project.platformType})`}<br />
                  {seasonorder}{seasonorder ? <br /> : null}
                  {project.status}
                  <hr />
                  {project.htmlSummary
                    ? <Interweave content={project.htmlSummary} transform={transformLinks} />
                    : <Card.Text>{project.summary}</Card.Text>}
                  {project.htmlNotes
                    ? <Interweave content={project.htmlNotes} transform={transformLinks} />
                    : <Card.Text>{project.notes}</Card.Text>}
                  {project.shootingLocation &&
                    <Card.Text><b>Shooting Location</b>: {project.shootingLocation}</Card.Text>}
                </Card.Text>
                <hr />
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
                  <br />}
                {project.addresses && project.addresses[0] &&
                  project.addresses.map((address, index) =>
                    <Components.AddressDetail key={getFullAddress(address) + index} address={address} />)}
                {project.links && project.links[0] &&
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
                  collectionName='Projects'
                  objectId={documentId}
                />
              </Tab>
              <Tab eventKey='history' title='History'>
                <Components.ProjectPatchesList project={project} documentId={document._id} />
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

ProjectsSingle.propTypes = {
  documentId: PropTypes.string.isRequired,
  document: PropTypes.object
}

const options = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment'
}

const mapPropsFunction = (props) => {
  const id = get(props, 'match.params._id')
  return {
    ...props,
    documentId: id,
    input: { id }
  }
}

registerComponent({
  name: 'ProjectsSingle',
  component: ProjectsSingle,
  hocs: [
    withCurrentUser,
    mapProps(mapPropsFunction), [withSingle2, options] // mapProps must precede withSingle
  ]
})
