import { Components } from 'meteor/vulcan:core'
import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardHeader, CardText, CardTitle } from 'reactstrap'
import Interweave from 'interweave'
import moment from 'moment'
import pluralize from 'pluralize'
import styled from 'styled-components'
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import { transform } from '../../modules/helpers.js'

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
      <CardBody>
        <CardTitle>Past Projects</CardTitle>
        {props.pastProjects.map((o, index) => <Components.PastProjectMini key={`PastProjectMini${index}`} documentId={o.projectId} />)}
      </CardBody>
    </Card>
  )
}

const OfficeDisplay = ({ office }) => {
  const displayDate =
    'Office as it was in the database before it was edited ' + moment(office.updatedAt).format(DATE_FORMAT_LONG)
    return (
      <>
      <Card className='card-accent-primary'>
        <CardHeader tag='h2'>{ office.displayName }</CardHeader>
      <CardBody>
        {office.addresses &&
          <CardTitle><b>{pluralize('Address', office.addresses.length)}</b></CardTitle>}
        {office.addresses &&
          office.addresses.map((o, index) => <Components.AddressDetail key={index} address={o} />)}
        {office.phones &&
          office.phones.map((o, index) => <Components.PhoneDetail key={index} phone={o} />)}
        {office.htmlBody &&
          <CardTitle className='mt-5'><b>Notes</b></CardTitle>}
        {office.htmlBody &&
          <Interweave content={office.htmlBody} transform={transform} />}
        {office.theContacts &&
          office.theContacts.length > 0 &&
          <CardTitle className='mt-5'><b>Contacts</b></CardTitle>}
            {office.theContacts &&
              office.theContacts.length > 0 &&
              office.theContacts.map((o, index) => <Components.ContactMini key={`ContactMini${index}`} documentId={o._id} />)}
        <Components.ErrorBoundary>
          {office.theProjects &&
            <CardTitle className='mt-5'><b>Projects</b></CardTitle>}
          {office.theProjects &&
            <Flextest>
            {office.theProjects.map((o, index) => <Components.ProjectMini key={`ProjectMini-${index}`} documentId={o._id} />)}
            </Flextest>
          }
        </Components.ErrorBoundary>
        {office.links &&
          <CardText className='mt-5'>
            {office.links.map((link, index) =>
              <Components.LinkDetail key={`link-detail-${index}`} link={link} />
            )}
          </CardText>
        }
      </CardBody>
      <CardFooter>
        <span className='text-muted'>{displayDate}</span>
      </CardFooter>
    </Card>
    {office.pastProjects &&
    <div>
        <PastProjects pastProjects={office.pastProjects} />
    </div>
    }
    </>
  )
}

export default OfficeDisplay
