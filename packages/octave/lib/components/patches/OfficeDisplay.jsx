import { Components } from 'meteor/vulcan:core'
import React from 'react'
import Card from 'react-bootstrap/Card'
import pluralize from 'pluralize'
import styled from 'styled-components'
import MyMarkdown from '../common/MyMarkdown'

const Flextest = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: flex-start;
`

function PastProjects (props) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Past Projects</Card.Title>
        {props.pastProjects.map((o, index) => <Components.PastProjectMini key={`PastProjectMini${index}`} documentId={o.projectId} />)}
      </Card.Body>
    </Card>
  )
}

const OfficeDisplay = ({ office }) => {
  if (!office) return null

  return (
    <>
      <Card className='card-accent-primary'>
        <Card.Header as='h2'>{office.displayName}</Card.Header>
        <Card.Body>
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
          {office.contacts && office.contacts.length > 0 &&
            <Card.Title className='mt-5'><b>Contacts</b></Card.Title>}
          {office.contacts &&
            office.contacts.length > 0 &&
            office.contacts.map((o, index) => <Components.ContactMini key={`ContactMini${index}`} documentId={o.contactId} />)}
          <Components.ErrorBoundary>
            {office.projects && office.projects.length > 0 &&
              <Card.Title className='mt-5'><b>Projects</b></Card.Title>}
            {office.projects &&
              office.projects.length > 0 &&
                <Flextest>
                  {office.projects.map((o, index) => <Components.ProjectMini key={`ProjectMini-${index}`} documentId={o.projectId} />)}
                </Flextest>}
          </Components.ErrorBoundary>
          {office.links &&
            <Card.Text className='mt-5'>
              {office.links.map((link, index) =>
                <Components.LinkDetail key={`link-detail-${index}`} link={link} />
              )}
            </Card.Text>}
        </Card.Body>
      </Card>
      {office.pastProjects &&
        <div>
          <PastProjects pastProjects={office.pastProjects} />
        </div>}
    </>
  )
}

export default OfficeDisplay
