import { Components, registerComponent, withAccess, withMulti, withMulti2 } from 'meteor/vulcan:core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Markup from 'interweave'
import isEqual from 'lodash/isEqual'
import log from 'loglevel'
import moment from 'moment'
import pluralize from 'pluralize'
import mapProps from 'recompose/mapProps'
import Contacts from '../../modules/contacts/collection.js'
import Offices from '../../modules/offices/collection.js'
import Projects from '../../modules/projects/collection.js'
import PastProjects from '../../modules/past-projects/collection.js'
import MyLoading from './MyLoading'
import { ACTIVE_PROJECT_STATUSES_ARRAY, DATE_FORMAT_SHORT_FRIENDLY } from '../../modules/constants.js'

const MyLoader = ({ cardClass }) => {
  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {[1, 2, 3, 4, 5, 6].map(o => {
        return (
          <Col className='my-2' key={o}>
            <Card className={cardClass}>
              <Card.Header>
                <MyLoading variant='primary' />
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <MyLoading height={63} />
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <MyLoading />
              </Card.Footer>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

const LatestContactUpdates = (props) => {
  const { error, loading, results } = props
  if (loading) {
    return <MyLoader cardClass='card-accent-contacts' />
  }
  if (error) {
    log.error('LatestContactUpdates error:', error)
    return null
  }
  const contacts = results

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
            <Card className='card-accent-contacts'>
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
  const { error, loading, results } = props
  if (loading) {
    return <MyLoader cardClass='card-accent-offices' />
  }
  if (error) {
    log.error('LatestOfficeUpdates error:', error)
    return null
  }
  const offices = results

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
            <Card className='card-accent-offices'>
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

const officesOptions = {
  collection: Offices,
  fragmentName: 'OfficesSingleFragment',
  limit: 6
}

registerComponent({
  name: 'LatestOfficeUpdates',
  component: LatestOfficeUpdates,
  hocs: [[withMulti, officesOptions]]
})

const ProjectUpdates = (props) => {
  const { callbackFn, error, loading, results } = props
  if (loading) {
    return <MyLoader cardClass='card-accent-projects' />
  }
  if (error) {
    log.error('ProjectUpdates error:', error)
    return null
  }
  const projects = results

  // on props change, callbackFn sends results up to LatestUpdates
  useEffect(() => {
    if (!loading && results && callbackFn) {
      callbackFn(results)
    }
  }, [results])

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
            <Card className='card-accent-projects'>
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

const newestProjectsCastingOptions = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment',
  limit: 6,
  terms: { view: 'projectsCastingByCreated' }
}

const activelyActive = ACTIVE_PROJECT_STATUSES_ARRAY.slice(0, 3) // Casting, Shooting, See Notes, the 3 that are actively Active
const latestProjectUpdatesOptions = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment',
  limit: 12,
  input: {
    filter: { status: { _in: activelyActive } },
    sort: { updatedAt: 'desc' }
  }
}

registerComponent({
  name: 'NewestProjectsCasting',
  component: ProjectUpdates,
  hocs: [[withMulti, newestProjectsCastingOptions]]
})

const mapPropsFunction = (props) => {
  const newestProjectsCastingIds = props.newestProjectsCastingIds
  return {
    ...props,
    input: { filter: { _id: { _nin: newestProjectsCastingIds } } }
  }
}

registerComponent({
  name: 'LatestProjectUpdates',
  component: ProjectUpdates,
  hocs: [
    mapProps(mapPropsFunction),
    [withMulti2, latestProjectUpdatesOptions]
  ]
})

const LatestPastProjectUpdates = (props) => {
  const { error, loading, results } = props
  if (loading) {
    return (
      <>
        <MyLoader cardClass='card-accent-pastprojects' />
        <MyLoader cardClass='card-accent-pastprojects' />
      </>
    )
  }
  if (error) {
    log.error('LatestPastProjectUpdates error:', error)
    return null
  }
  const pastProjects = results

  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {pastProjects.map(project =>
        <Col className='my-2' key={project._id}>
          <Card className='card-accent-pastprojects'>
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
              <small className='text-muted'>Past Project updated {moment(project.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)}</small>
            </Card.Footer>
          </Card>
        </Col>
      )}
    </Row>
  )
}

const pastProjectsOptions = {
  collection: PastProjects,
  fragmentName: 'PastProjectsSingleFragment',
  limit: 6
}

registerComponent({
  name: 'LatestPastProjectUpdates',
  component: LatestPastProjectUpdates,
  hocs: [[withMulti, pastProjectsOptions]]
})

const LatestUpdates = () => {
  const [newestProjectsCastingIds, setNewestProjectsCastingIds] = useState([])

  // callbackFn gets results from NewestProjectsCasting,
  // makes newestProjectsCastingIds available to LatestProjectUpdates
  const callbackFn = (results) => {
    const ids = results.map(result => result._id)
    if (!isEqual(newestProjectsCastingIds, ids)) {
      setNewestProjectsCastingIds(ids)
    }
  }

  return (
    <div className='animated fadeIn'>
      <Components.HeadTags title='V8: Latest Updates' />
      <Card>
        <Card.Body>
          <Card.Title>Newest Projects Casting</Card.Title>
          <Components.NewestProjectsCasting
            callbackFn={callbackFn}
          />
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Additional Recently Updated Active Projects</Card.Title>
          {newestProjectsCastingIds.length &&
            <Components.LatestProjectUpdates
              newestProjectsCastingIds={newestProjectsCastingIds}
            />}
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
          <Card.Title>Recently Updated Past Projects</Card.Title>
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
