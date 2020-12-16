import { Components, getSetting, registerComponent, useCurrentUser, useSingle2 } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import get from 'lodash/get'
import MyMarkdown from '../common/MyMarkdown'
import ErrorWithAlgoliaDelete from '../algolia/ErrorWithAlgoliaDelete'
import RecreateAlgoliaRecord from '../algolia/RecreateAlgoliaRecord'
import { displayDates, getFullAddress, isEditor, seasonOrder } from '../../modules/helpers'
import Projects from '../../modules/projects/collection.js'

const ProjectsSingle = (props) => {
  const documentId = get(props, 'match.params._id')
  const { currentUser } = useCurrentUser()
  const showEditors = isEditor(currentUser)
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

  if (error?.message === 'app.missing_document' && getSetting('algolia.enableErrorDelete')) {
    return (
      <ErrorWithAlgoliaDelete documentId={documentId} variant='projects' />
    )
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
      <FormattedMessage id='app.404' />
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
            {showEditors &&
              <Tab eventKey='editors' title='Editors Only'>
                <RecreateAlgoliaRecord collectionName='projects' document={project} />
              </Tab>}
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
