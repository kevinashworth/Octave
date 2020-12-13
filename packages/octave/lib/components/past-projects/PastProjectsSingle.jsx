import { Components, registerComponent, useCurrentUser, useSingle2, withMessages } from 'meteor/vulcan:core'
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
import ErrorWithAlgoliaDelete from '../algolia/ErrorWithAlgoliaDelete'
import { displayDates, seasonOrder } from '../../modules/helpers.js'
import PastProjects from '../../modules/past-projects/collection.js'

const PastProjectsSingle = (props) => {
  const documentId = get(props, 'match.params._id')
  const { currentUser } = useCurrentUser()
  const { document: project, error, loading } = useSingle2({
    collection: PastProjects,
    fragmentName: 'PastProjectsSingleFragment',
    input: { id: documentId },
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })
  const [commentsTabTitle, setCommentsTabTitle] = useState('Comments')

  const commentsCallback = (labelFromCommentsThread) => {
    setCommentsTabTitle(labelFromCommentsThread)
  }

  if (error?.message === 'app.missing_document') {
    return (
      <ErrorWithAlgoliaDelete documentId={documentId} variant='pastprojects' />
    )
  }

  if (error) {
    console.error('PastProjectsSingle useQuery error:', error)
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
  const dates = displayDates('Project first', project)

  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title={project.projectTitle} />
      <Card className='card-accent-pastprojects'>
        <Card.Header as='h2' data-cy='pastproject-header'>
          {project.projectTitle}
          {Users.canUpdate({ collection: PastProjects, user: currentUser, project }) &&
            <div className='float-right'>
              <LinkContainer to={`/past-projects/${project._id}/edit`} data-cy='edit-button'>
                <Button variant='secondary'>Edit</Button>
              </LinkContainer>
            </div>}
        </Card.Header>
        <Card.Body>
          <Tabs defaultActiveKey='main' id='past_projects_single_tabs'>
            <Tab eventKey='main' title='Main'>
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
                <hr />
              </Card.Text>
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
            <Tab eventKey='comments' title={commentsTabTitle}>
              <Components.CommentsThread
                callbackFromSingle={commentsCallback}
                collectionName='Projects'
                objectId={project._id}
              />
            </Tab>
            <Tab eventKey='history' title='History'>
              <Components.PastProjectPatchesList documentId={project._id} />
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
  name: 'PastProjectsSingle',
  component: PastProjectsSingle
})
