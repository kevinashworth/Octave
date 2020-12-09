import { Components, registerComponent, useCurrentUser, useSingle2 } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import get from 'lodash/get'
import MyMarkdown from '../common/MyMarkdown'
import { displayDates, getFullAddress, seasonOrder } from '../../modules/helpers.js'
import Projects from '../../modules/projects/collection.js'

const ProjectsSingle = (props) => {
  const documentId = get(props, 'match.params._id')

  const { currentUser } = useCurrentUser()
  const { document: project, error, loading } = useSingle2({
    collection: Projects,
    fragmentName: 'ProjectsSingleFragment',
    input: {
      id: documentId
    },
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })
  const [commentsTabTitle, setCommentsTabTitle] = useState('Comments')

  const commentsCallback = (labelFromCommentsThread) => {
    setCommentsTabTitle(labelFromCommentsThread)
  }

  const deleteAlgoliaRecord = (documentId) => {
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

  if (error) {
    console.error('ProjectsSingle useQuery error:', error)
    return <FormattedMessage id='errors.document' values={{ errorMessage: error.message }} />
  }

  if (loading && !project) { // 2020-11-17: 'cache-and-network' loading doesn't work as expected
    return <Components.Loading />
  }

  if (!project) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>
            <FormattedMessage id='app.missing_document' />
          </Card.Text>
          {Users.isAdmin(currentUser) &&
            <Card.Text>
              <Button variant='projects' onClick={deleteAlgoliaRecord(documentId)}>Admin: Delete {documentId} from Algolia</Button>{' '}
              <Link to={`/past-projects/${documentId}`}>Is this _id for a Past Project?</Link>
            </Card.Text>}
        </Card.Body>
      </Card>
    )
  }

  const order = seasonOrder(project)
  const dates = displayDates('Project', project)

  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title={project.projectTitle} />
      <Card className='card-accent-projects'>
        <Card.Header as='h2' data-cy='project-header'>
          {project.projectTitle}
          {Users.canUpdate({ collection: Projects, user: currentUser, project }) &&
            <div className='float-right'>
              <LinkContainer to={`/projects/${project._id}/edit`} data-cy='edit-button'>
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
                {order}{order ? <br /> : null}
                {project.status}
                <hr />
                {project.summary
                  ? <MyMarkdown id='projects.summary_heading' markdown={project.summary} />
                  : null}
                {project.notes
                  ? <MyMarkdown id='projects.notes_heading' markdown={project.notes} />
                  : null}
                {project.shootingLocation
                  ? <MyMarkdown id='projects.shooting_heading' markdown={project.shootingLocation} />
                  : null}
              </Card.Text>
              <hr />
              {project.website &&
                <Card.Text>
                  <Card.Link href={project.website} target='_websites'>Open official website <i className='fad fa-external-link' /></Card.Link>
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
            <Tab eventKey='comments' title={commentsTabTitle}>
              <Components.CommentsThread
                callbackFromSingle={commentsCallback}
                collectionName='Projects'
                objectId={documentId}
              />
            </Tab>
            <Tab eventKey='history' title='History'>
              <Components.ProjectPatchesList project={project} documentId={project._id} />
            </Tab>
          </Tabs>
        </Card.Body>
        <Card.Footer>
          <small className='text-muted'>{dates}</small>
        </Card.Footer>
      </Card>
    </div>
  )
}

registerComponent({
  name: 'ProjectsSingle',
  component: ProjectsSingle
})
