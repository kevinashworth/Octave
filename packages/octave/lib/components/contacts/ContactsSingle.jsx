import { Components, registerComponent, useCurrentUser, useSingle2, withAccess, withMessages } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Collapse from 'react-bootstrap/Collapse'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import pluralize from 'pluralize'
import MyMarkdown from '../common/MyMarkdown'
import ErrorWithAlgoliaDelete from '../algolia/ErrorWithAlgoliaDelete'
import { displayDates, getFullNameFromContact, isEmptyValue } from '../../modules/helpers.js'
import Contacts from '../../modules/contacts/collection.js'

// Don't fetch PastProjects unless user clicks to see them
// See https://reactjs.org/docs/conditional-rendering.html#preventing-component-from-rendering
function PastProjects (props) {
  const { collapseIsOpen, pastProjects } = props
  if (!collapseIsOpen) {
    return null
  }
  const sortedProjects = sortBy(pastProjects, 'projectTitle') // NB: 'sortTitle' not available here
  return (
    <Card>
      <Card.Body>
        <Card.Title>Past Projects</Card.Title>
        {sortedProjects.map((o, index) =>
          <Components.PastProjectMini key={`PastProjectMini${index}`} documentId={o.projectId} />)}
      </Card.Body>
    </Card>
  )
}

const ContactsSingle = (props) => {
  const documentId = get(props, 'match.params._id')
  const { currentUser } = useCurrentUser()
  const { document: contact, error, loading } = useSingle2({
    collection: Contacts,
    fragmentName: 'ContactsSingleFragment',
    input: { id: documentId },
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })
  const [commentsTabTitle, setCommentsTabTitle] = useState('Comments')
  const [collapseIsOpen, setCollapseIsOpen] = useState(false)

  const commentsCallback = (labelFromCommentsThread) => {
    setCommentsTabTitle(labelFromCommentsThread)
  }

  const handleCollapseClick = () => {
    setCollapseIsOpen(!collapseIsOpen)
  }

  if (error?.message === 'app.missing_document') {
    return (
      <ErrorWithAlgoliaDelete documentId={documentId} />
    )
  }

  if (error) {
    console.error('ContactsSingle useQuery error:', error)
    return <FormattedMessage id='errors.document' values={{ errorMessage: error.message }} />
  }

  if (loading && !contact) { // 2020-11-17: 'cache-and-network' loading doesn't work as expected
    return <Components.Loading />
  }

  if (!contact) {
    return (
      <FormattedMessage id='app.404' />
    )
  }

  const dates = displayDates('Contact', contact)

  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title={contact.displayName} />
      <Card className='card-accent-contacts'>
        <Card.Header as='h2' data-cy='contact-header'>
          {getFullNameFromContact(contact)}
          {Users.canUpdate({ collection: Contacts, user: currentUser, contact }) &&
            <div className='float-right'>
              <LinkContainer to={`/contacts/${contact._id}/edit`} data-cy='edit-button'>
                <Button variant='secondary'>Edit</Button>
              </LinkContainer>
            </div>}
        </Card.Header>
        <Card.Body>
          <Tabs defaultActiveKey='main' id='contacts_single_tabs'>
            <Tab eventKey='main' title='Main'>
              <Card.Text as='div' data-cy='contact-name-title-gender-body'>
                <b>{contact.displayName}</b>
                {contact.title && <div>{contact.title}</div>}
                {contact.gender && <div>{contact.gender}</div>}
                <hr />
                {contact.body
                  ? <MyMarkdown markdown={contact.body} />
                  : null}
              </Card.Text>
              {!isEmptyValue(contact.offices) &&
                <Card.Title className='mt-5'><b>{pluralize('Office', contact.offices.length)}</b></Card.Title>}
              {!isEmptyValue(contact.offices) &&
                contact.offices.map((o, index) =>
                  <Components.OfficeMini key={index} documentId={o.officeId} />
                )}
              {contact.addresses && contact.addresses.length > 0 &&
                <Card.Title><b>{pluralize('Address', contact.addresses.length)}</b></Card.Title>}
              {contact.addresses && contact.addresses.length > 0 &&
                contact.addresses.map((o, index) => <Components.AddressDetail key={index} address={o} />)}
              {!isEmptyValue(contact.projects) &&
                <Card.Title className='mt-5'><b>Projects</b></Card.Title>}
              {!isEmptyValue(contact.projects) &&
                contact.projects.map((project, index) => <Components.ProjectMini key={`ProjectMini-${index}`} documentId={project.projectId} titleForProject={contact.title === project.titleForProject ? null : project.titleForProject} />
                )}
              {contact.links &&
                <Card.Title className='mt-5'><b>Links</b></Card.Title>}
              {contact.links &&
                <Card.Text>
                  {contact.links.map((link, index) =>
                    <Components.LinkDetail key={`link-detail-${index}`} link={link} />
                  )}
                </Card.Text>}
            </Tab>
            <Tab eventKey='comments' title={commentsTabTitle}>
              <Components.CommentsThread
                callbackFromSingle={commentsCallback}
                collectionName='Contacts'
                objectId={contact._id}
              />
            </Tab>
            <Tab eventKey='history' title='History'>
              <Components.ContactPatchesList documentId={contact._id} />
            </Tab>
          </Tabs>
        </Card.Body>
        <Card.Footer>
          <small className='text-muted'>{dates}</small>
        </Card.Footer>
      </Card>
      {contact.pastProjects &&
        <div>
          <Button
            className='mb-3'
            onClick={handleCollapseClick}
            variant='link'
            data-cy='show-hide-past-projects'
          >{`${collapseIsOpen ? 'Hide' : 'Show'} Past Projects`}
          </Button>
          <Collapse isOpen={collapseIsOpen}>
            <PastProjects collapseIsOpen={collapseIsOpen} pastProjects={contact.pastProjects} />
          </Collapse>
        </div>}
    </div>
  )
}

const accessOptions = {
  groups: ['participants', 'editors', 'admins'],
  redirect: '/welcome/new'
}

registerComponent({
  name: 'ContactsSingle',
  component: ContactsSingle,
  hocs: [[withAccess, accessOptions], withMessages]
})
