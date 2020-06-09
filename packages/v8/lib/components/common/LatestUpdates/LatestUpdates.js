import { Components, registerComponent, withAccess, withMulti } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Markup from 'interweave'
import moment from 'moment'
import pluralize from 'pluralize'
import ContentLoader from 'react-content-loader'
import Contacts from '../../../modules/contacts/collection.js'
import Offices from '../../../modules/offices/collection.js'
import Projects from '../../../modules/projects/collection.js'
import PastProjects from '../../../modules/past-projects/collection.js'
import { DATE_FORMAT_SHORT_FRIENDLY } from '../../../modules/constants.js'

const MyLoader = ({ cardClass }) => {
  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {[1, 2, 3, 4, 5, 6].map(o => {
        return (
          <Col className='my-2' key={o}>
            <Card className={cardClass}>
              <Card.Header>
                <ContentLoader animate={false} height={14} />
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <ContentLoader animate={false} height={56} />
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small><ContentLoader animate={false} height={11} /></small>
              </Card.Footer>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

const LatestContactUpdates = (props) => {
  if (props.networkStatus !== 8 && props.networkStatus !== 7) {
    return <MyLoader cardClass='card-accent-warning' />
  }

  const contacts = props.results || []

  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {contacts.map(contact => {
        const isItNew = moment(contact.updatedAt).isBefore(moment(contact.createdAt).add(1, 'day'))
        let displayHtml = isItNew
          ? '<b>New!</b> Contact added '
          : 'Contact updated '
        displayHtml += moment(contact.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)
        return (
          <Col className='my-2' key={contact._id}>
            <Card className='card-accent-warning'>
              <Card.Header className='text-truncate'>
                <b><Link to={`/contacts/${contact._id}/${contact.slug}`}>{contact.displayName}</Link></b>
                <small className='float-right'>{contact.theAddress.location}</small>
              </Card.Header>
              <Card.Body className='text-truncate'>
                <Card.Text>
                  {contact.title}<br />
                  {pluralize('Project', contact.projects ? contact.projects.length : 0, true)}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className='text-muted'><Markup content={displayHtml} /></small>
              </Card.Footer>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

LatestContactUpdates.propTypes = {
  results: PropTypes.array
}

const contactsOptions = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment',
  limit: 6
}

registerComponent({
  name: 'LatestContactUpdates',
  component: LatestContactUpdates,
  hocs: [[withMulti, contactsOptions]]
})

const LatestOfficeUpdates = (props) => {
  if (props.networkStatus !== 8 && props.networkStatus !== 7) {
    return <MyLoader cardClass='card-accent-primary' />
  }

  const offices = props.results || []

  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {offices.map(office => {
        const isItNew = moment(office.updatedAt).isBefore(moment(office.createdAt).add(1, 'day'))
        let displayHtml = isItNew
          ? '<b>New!</b> Office added '
          : 'Office updated '
        displayHtml += moment(office.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)
        return (
          <Col className='my-2' key={office._id}>
            <Card className='card-accent-primary'>
              <Card.Header className='text-truncate d-block'>
                <b><Link to={`/offices/${office._id}/${office.slug}`}>{office.displayName}</Link></b>
              </Card.Header>
              <Card.Body className='text-truncate d-block'>
                {office.theCity} {office.theState}<br />
                {pluralize('Project', office.projects ? office.projects.length : 0, true)}
              </Card.Body>
              <Card.Footer>
                <small className='text-muted'><Markup content={displayHtml} /></small>
              </Card.Footer>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

LatestOfficeUpdates.propTypes = {
  results: PropTypes.array
}

const officesOptions = {
  collection: Offices,
  fragmentName: 'OfficesSingleFragment',
  terms: { view: 'officesByUpdated' },
  limit: 6
}

registerComponent({
  name: 'LatestOfficeUpdates',
  component: LatestOfficeUpdates,
  hocs: [[withMulti, officesOptions]]
})

const LatestProjectUpdates = (props) => {
  if (props.networkStatus !== 8 && props.networkStatus !== 7) {
    return <MyLoader cardClass='card-accent-danger' />
  }

  const projects = props.results || []

  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {projects.map(project => {
        const isItNew = moment(project.updatedAt).isBefore(moment(project.createdAt).add(1, 'day'))
        let displayHtml = isItNew
          ? '<b>New!</b> Project added '
          : 'Project updated '
        displayHtml += moment(project.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)
        return (
          <Col className='my-2' key={project._id}>
            <Card className='card-accent-danger'>
              <Card.Header className='text-truncate'>
                <b><Link to={`/projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></b>
              </Card.Header>
              <Card.Body className='text-truncate'>
                <Card.Text>
                  {project.network && (project.projectType.indexOf('TV') === 0 || project.projectType.indexOf('Pilot') === 0)
                    ? `${project.projectType} • ${project.network}`
                    : `${project.projectType}`}<br />
                  {project.status}<br />
                  {project.casting}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className='text-muted'><Markup content={displayHtml} /></small>
              </Card.Footer>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

LatestProjectUpdates.propTypes = {
  results: PropTypes.array
}

const projectsOptions1 = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment',
  limit: 6,
  terms: { view: 'newestProjectsCasting' }
}

const projectsOptions2 = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment',
  limit: 12
}

registerComponent({
  name: 'NewestProjectsAdded',
  component: LatestProjectUpdates,
  hocs: [[withMulti, projectsOptions1]]
})

registerComponent({
  name: 'LatestProjectUpdates',
  component: LatestProjectUpdates,
  hocs: [[withMulti, projectsOptions2]]
})

const LatestPastProjectUpdates = (props) => {
  if (props.networkStatus !== 8 && props.networkStatus !== 7) {
    return (
      <>
        <MyLoader cardClass='card-accent-secondary' />
        <MyLoader cardClass='card-accent-secondary' />
      </>
    )
  }

  const pastProjects = props.results || []

  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {pastProjects.map(project =>
        <Col className='my-2' key={project._id}>
          <Card className='card-accent-secondary'>
            <Card.Header className='text-truncate d-block'>
              <b><Link to={`/past-projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></b>
            </Card.Header>
            <Card.Body className='text-truncate d-block'>
              {project.network && (project.projectType.indexOf('TV') === 0 || project.projectType.indexOf('Pilot') === 0)
                ? `${project.projectType} • ${project.network}`
                : `${project.projectType}`}<br />
              {project.status}<br />
              {project.castingCompany
                ? project.castingCompany
                : project.castingOffice
                  ? project.castingOffice.displayName
                  : null}
            </Card.Body>
            <Card.Footer>
              <small className='text-muted'>Past Project as of {moment(project.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)}</small>
            </Card.Footer>
          </Card>
        </Col>
      )}
    </Row>
  )
}

LatestPastProjectUpdates.propTypes = {
  results: PropTypes.array
}

const pastProjectsOptions = {
  collection: PastProjects,
  fragmentName: 'PastProjectsSingleFragment',
  limit: 6,
  terms: { view: 'newestPastProjects' }
}

registerComponent({
  name: 'LatestPastProjectUpdates',
  component: LatestPastProjectUpdates,
  hocs: [[withMulti, pastProjectsOptions]]
})

const LatestUpdates = () => {
  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8: Latest Updates' />

      <Card>
        <Card.Body>
          <Card.Title>Newest Projects Casting</Card.Title>
          <Components.NewestProjectsAdded />
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Recently Updated Contacts</Card.Title>
          <Components.LatestContactUpdates />
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Recently Updated Offices</Card.Title>
          <Components.LatestOfficeUpdates />
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Recently Updated Projects</Card.Title>
          <Components.LatestProjectUpdates />
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Newest Past Projects</Card.Title>
          <Components.LatestPastProjectUpdates />
        </Card.Body>
      </Card>
    </div>
  )
}

const accessOptions = {
  groups: ['members', 'admins'],
  redirect: '/login'
}

registerComponent({
  name: 'LatestUpdates',
  component: LatestUpdates,
  hocs: [
    [withAccess, accessOptions]
  ]
})
