import { Components, registerComponent, useMulti2, withAccess } from 'meteor/vulcan:core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import isEqual from 'lodash/isEqual'
import log from 'loglevel'
import moment from 'moment'
import pluralize from 'pluralize'
import { useUnmount } from '../../hooks'
import Contacts from '../../modules/contacts/collection.js'
import Offices from '../../modules/offices/collection.js'
import Projects from '../../modules/projects/collection.js'
import PastProjects from '../../modules/past-projects/collection.js'
import MyLoading from './MyLoading'
import { ACTIVE_PROJECT_STATUSES_ARRAY, DATE_FORMAT_SHORT_FRIENDLY } from '../../modules/constants.js'

// ALL
const MyUpdated = ({ document }) => {
  const { createdAt, updatedAt, __typename: typename } = document
  const isItNew = moment(updatedAt).isBefore(moment(createdAt).add(1, 'day'))
  return (
    <small className='text-muted'>
      {isItNew && <b>New!</b>}{' '}
      {typename}{' '}
      {isItNew ? 'added' : 'updated'}{' '}
      {moment(updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)}
    </small>
  )
}

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

// CONTACTS
const LatestContactUpdates = () => {
  const { error, loading, results } = useMulti2({
    collection: Contacts,
    fragmentName: 'ContactsSingleFragment',
    input: {
      sort: { updatedAt: 'desc' }
    },
    limit: 6,
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })

  if (loading && !results) { // 2020-11-17: 'cache-and-network' loading doesn't work as expected
    return <MyLoader cardClass='card-accent-contacts' />
  }

  if (error) {
    log.error('LatestContactUpdates error:', error)
    return null
  }

  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {results.map(contact => {
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
                <MyUpdated document={contact} />
              </Card.Footer>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

// OFFICES
const LatestOfficeUpdates = () => {
  const { error, loading, results } = useMulti2({
    collection: Offices,
    fragmentName: 'OfficesSingleFragment',
    input: {
      sort: { updatedAt: 'desc' }
    },
    limit: 6,
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })

  if (loading && !results) { // 2020-11-17: 'cache-and-network' loading doesn't work as expected
    return <MyLoader cardClass='card-accent-offices' />
  }

  if (error) {
    log.error('LatestOfficeUpdates error:', error)
    return null
  }

  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {results.map(office => {
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
                <MyUpdated document={office} />
              </Card.Footer>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

// PROJECTS
const ProjectUpdates = (props) => {
  const { callbackFn, error, loading, results } = props
  // on props change, callbackFn sends results up to LatestUpdates
  useEffect(() => {
    if (callbackFn && !loading && results) {
      callbackFn(results)
    }
  }, [callbackFn, loading, results])

  if (loading && !results) { // 2020-11-17: 'cache-and-network' loading doesn't work as expected
    return <MyLoader cardClass='card-accent-projects' />
  }

  if (error) {
    log.error('ProjectUpdates error:', error)
    return null
  }

  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {results.map(project => {
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
                <MyUpdated document={project} />
              </Card.Footer>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

const activelyActive = ACTIVE_PROJECT_STATUSES_ARRAY.slice(0, 3) // Casting, Shooting, See Notes, the 3 that are actively Active

const NewestProjectsCasting = ({ callbackFn }) => {
  const { error, loading, results } = useMulti2({
    collection: Projects,
    fragmentName: 'ProjectsSingleFragment',
    input: {
      filter: { status: { _in: activelyActive } },
      sort: { createdAt: 'desc' }
    },
    limit: 6,
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })
  return (
    <ProjectUpdates callbackFn={callbackFn} error={error} loading={loading} results={results} />
  )
}

const LatestProjectUpdates = ({ newestProjectsCastingIds }) => {
  // to avoid GraphQL error, compose filter conditionally
  const [projects, setProjects] = useState([])
  const filter = {
    status: { _in: activelyActive }
  }
  if (newestProjectsCastingIds.length) {
    filter._id = { _nin: newestProjectsCastingIds }
  }

  const { error, loading, results } = useMulti2({
    collection: Projects,
    fragmentName: 'ProjectsSingleFragment',
    input: {
      filter,
      sort: { updatedAt: 'desc' }
    },
    limit: 12,
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })

  useEffect(() => {
    if (results) {
      setProjects(results)
    }
  }, [results])

  return (
    <ProjectUpdates error={error} loading={loading} results={projects} />
  )
}

// PAST PROJECTS
const LatestPastProjectUpdates = () => {
  const { error, loading, results } = useMulti2({
    collection: PastProjects,
    fragmentName: 'PastProjectsSingleFragment',
    input: {
      sort: { updatedAt: 'desc' }
    },
    limit: 6,
    queryOptions: {
      fetchPolicy: 'cache-and-network'
    }
  })

  if (loading && !results) { // 2020-11-17: 'cache-and-network' loading doesn't work as expected
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

  return (
    <Row className='row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xxxl-6'>
      {results.map(project =>
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
              {project.casting}
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

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  newestProjectsCastingIds: []
}

const LatestUpdates = () => {
  const [newestProjectsCastingIds, setNewestProjectsCastingIds] = useState(keptState.newestProjectsCastingIds)

  // callbackFn gets results from NewestProjectsCasting,
  // makes newestProjectsCastingIds available to LatestProjectUpdates
  const callbackFn = (results) => {
    const ids = results.map(result => result._id)
    if (!isEqual(newestProjectsCastingIds, ids)) {
      setNewestProjectsCastingIds(ids)
    }
  }

  useUnmount(() => {
    keptState = {
      newestProjectsCastingIds
    }
  })

  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title='Latest Updates' />
      <Card>
        <Card.Body>
          <Card.Title>Newest Projects Casting</Card.Title>
          <NewestProjectsCasting callbackFn={callbackFn} />
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Additional Recently Updated Active Projects</Card.Title>
          <LatestProjectUpdates newestProjectsCastingIds={newestProjectsCastingIds} />
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Recently Updated Contacts</Card.Title>
          <LatestContactUpdates />
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Recently Updated Offices</Card.Title>
          <LatestOfficeUpdates />
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Recently Updated Past Projects</Card.Title>
          <LatestPastProjectUpdates />
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
