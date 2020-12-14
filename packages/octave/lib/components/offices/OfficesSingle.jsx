import { Components, getSetting, registerComponent, useCurrentUser, useSingle2, withMessages } from 'meteor/vulcan:core'
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
import { displayDates } from '../../modules/helpers.js'
import Offices from '../../modules/offices/collection.js'

// Don't fetch and render PastProjects unless user clicks to see them
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

const OfficesSingle = (props) => {
  const documentId = get(props, 'match.params._id')
  const { currentUser } = useCurrentUser()
  const { document: office, error, loading } = useSingle2({
    collection: Offices,
    fragmentName: 'OfficesSingleFragment',
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

  if (error?.message === 'app.missing_document' && getSetting('algolia.enableErrorDelete')) {
    return (
      <ErrorWithAlgoliaDelete documentId={documentId} />
    )
  }

  if (error) {
    console.error('OfficesSingle useQuery error:', error)
    return <FormattedMessage id='errors.document' values={{ errorMessage: error.message }} />
  }

  if (loading && !office) { // 2020-11-17: 'cache-and-network' loading doesn't work as expected
    return <Components.Loading />
  }

  if (!office) {
    return (
      <FormattedMessage id='app.404' />
    )
  }

  const dates = displayDates('Office', office)

  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title={office.displayName} />
      <Card className='card-accent-offices'>
        <Card.Header as='h2' data-cy='office-header'>
          {office.displayName}
          {Users.canUpdate({ collection: Offices, user: currentUser, office }) &&
            <div className='float-right'>
              <LinkContainer to={`/offices/${office._id}/edit`} data-cy='edit-button'>
                <Button variant='secondary'>Edit</Button>
              </LinkContainer>
            </div>}
        </Card.Header>
        <Card.Body>
          <Tabs defaultActiveKey='main' id='offices_single_tabs'>
            <Tab eventKey='main' title='Main'>
              {office.addresses &&
                <Card.Title><b>{pluralize('Address', office.addresses.length)}</b></Card.Title>}
              {office.addresses &&
                office.addresses.map((o, index) => <Components.AddressDetail key={index} address={o} />)}
              {office.phones &&
                office.phones.map((o, index) => <Components.PhoneDetail key={index} phone={o} />)}
              {office.body &&
                <Card.Title className='mt-5'><b>Notes</b></Card.Title>}
              {office.body
                ? <MyMarkdown markdown={office.body} />
                : null}
              {office.theContacts && office.theContacts.length > 0 &&
                <Card.Title className='mt-5'><b>Contacts</b></Card.Title>}
              {office.theContacts && office.theContacts.length > 0 &&
                office.theContacts.map((o, index) => <Components.ContactMini key={`ContactMini${index}`} documentId={o._id} />)}
              <Components.ErrorBoundary>
                {office.theProjects &&
                  <Card.Title className='mt-5'><b>Projects</b></Card.Title>}
                {office.theProjects &&
                  office.theProjects.map((o, index) => <Components.ProjectMini key={`ProjectMini-${index}`} documentId={o._id} />)}
              </Components.ErrorBoundary>
              {office.links &&
                <Card.Title className='mt-5'><b>Links</b></Card.Title>}
              {office.links && office.links.map((link, index) =>
                <Components.LinkDetail key={`link-detail-${index}`} link={link} />
              )}
            </Tab>
            <Tab eventKey='comments' title={commentsTabTitle}>
              <Components.CommentsThread
                callbackFromSingle={commentsCallback}
                collectionName='Offices'
                objectId={office._id}
              />
            </Tab>
            <Tab eventKey='history' title='History'>
              <Components.OfficePatchesList documentId={office._id} />
            </Tab>
          </Tabs>
        </Card.Body>
        <Card.Footer>
          <small className='text-muted'>{dates}</small>
        </Card.Footer>
      </Card>
      {office.pastProjects &&
        <div>
          <Button
            className='mb-3'
            onClick={handleCollapseClick}
            variant='link'
            data-cy='show-hide-past-projects'
          >
            {`${collapseIsOpen ? 'Hide' : 'Show'} Past Projects`}
          </Button>
          <Collapse isOpen={collapseIsOpen}>
            <PastProjects collapseIsOpen={collapseIsOpen} pastProjects={office.pastProjects} />
          </Collapse>
        </div>}
    </div>
  )
}

registerComponent({
  name: 'OfficesSingle',
  component: OfficesSingle,
  hocs: [withMessages]
})
