import { Components, registerComponent, withAccess, withMulti } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import Contacts from '../../../modules/contacts/collection.js'
import Offices from '../../../modules/offices/collection.js'
import Projects from '../../../modules/projects/collection.js'
import moment from 'moment'
import { DATE_FORMAT_SHORT_FRIENDLY } from '../../../modules/constants.js'

class LatestContactUpdates extends Component {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    return (
      <Row>
        {this.props.results.map(contact => {
          const isItNew = moment(contact.updatedAt).isBefore(moment(contact.createdAt).add(1, 'day'))
          let displayHtml = isItNew
            ? '<b>New!</b> Contact added '
            : 'Contact updated '
          displayHtml += moment(contact.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)
          return (
            <Col xs='12' sm='6' md='4' key={contact._id}>
              <Card className='card-accent-warning'>
                <CardHeader>
                  <b><Link to={`/contacts/${contact._id}/${contact.slug}`}>{contact.displayName}</Link></b>
                </CardHeader>
                <CardBody>
                  {contact.title}<br />
                  {contact.theCity} {contact.theState}<br />
                </CardBody>
                <CardFooter>
                  <small className='text-muted' dangerouslySetInnerHTML={{ __html: displayHtml }} />
                </CardFooter>
              </Card>
            </Col>
          )
        })}
      </Row>
    )
  }
}

const contactOptions = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment',
  limit: 6
}

registerComponent({
  name: 'LatestContactUpdates',
  component: LatestContactUpdates,
  hocs: [[withMulti, contactOptions]]
})

class LatestOfficeUpdates extends Component {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    return (
      <Row>
        {this.props.results.map(office => {
          const isItNew = moment(office.updatedAt).isBefore(moment(office.createdAt).add(1, 'day'))
          let displayHtml = isItNew
            ? '<b>New!</b> Office added '
            : 'Office updated '
          displayHtml += moment(office.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)
          return (
            <Col xs='12' sm='6' md='4' key={office._id}>
              <Card className='card-accent-primary'>
                <CardHeader>
                  <b><Link to={`/offices/${office._id}/${office.slug}`}>{office.displayName}</Link></b>
                </CardHeader>
                <CardBody>
                  {office.theCity} {office.theState}<br />
                  {office.projects ? office.projects.length + ' Projects' : null}
                </CardBody>
                <CardFooter>
                  <small className='text-muted' dangerouslySetInnerHTML={{ __html: displayHtml }} />
                </CardFooter>
              </Card>
            </Col>
          )
        })}
      </Row>
    )
  }
}

const officeOptions = {
  collection: Offices,
  fragmentName: 'OfficesSingleFragment',
  limit: 6
}

registerComponent({
  name: 'LatestOfficeUpdates',
  component: LatestOfficeUpdates,
  hocs: [[withMulti, officeOptions]]
})

class LatestActiveProjectUpdates extends Component {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    return (
      <Row>
        {this.props.results.map(project => {
          const isItNew = moment(project.updatedAt).isBefore(moment(project.createdAt).add(1, 'day'))
          let displayHtml = isItNew
            ? '<b>New!</b> Project added '
            : 'Project updated '
          displayHtml += moment(project.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)
          return (
            <Col xs='12' sm='6' md='4' key={project._id}>
              <Card className='card-accent-danger'>
                <CardHeader>
                  <b><Link to={`/projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></b>
                </CardHeader>
                <CardBody>
                  {project.projectType.indexOf('TV') === 0 || project.projectType.indexOf('Pilot') === 0
                    ? `${project.projectType} • ${project.network}` : `${project.projectType}`}<br />
                  {project.status}<br />
                  {project.castingCompany}<br />
                </CardBody>
                <CardFooter>
                  <small className='text-muted' dangerouslySetInnerHTML={{ __html: displayHtml }} />
                </CardFooter>
              </Card>
            </Col>
          )
        })}
      </Row>
    )
  }
}

const projectOptions = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment',
  limit: 6,
  terms: {
    view: 'collectionWithStatus',
    status: { $in: ['Casting', 'Ordered', 'Pre-Prod.', 'Shooting', 'See Notes', 'On Hiatus', 'On Hold'] }
  }
}

registerComponent({
  name: 'LatestActiveProjectUpdates',
  component: LatestActiveProjectUpdates,
  hocs: [[withMulti, projectOptions]]
})

class LatestInactiveProjectUpdates extends Component {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    return (
      <Row>
        {this.props.results.map(project =>
          <Col xs='12' sm='6' md='4' key={project._id}>
            <Card className='card-accent-secondary'>
              <CardHeader>
                <b><Link to={`/projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></b>
              </CardHeader>
              <CardBody>
                {project.projectType.indexOf('TV') === 0 || project.projectType.indexOf('Pilot') === 0
                  ? `${project.projectType} • ${project.network}` : `${project.projectType}`}<br />
                {project.status}<br />
                {project.castingCompany}<br />
              </CardBody>
              <CardFooter>
                <small className='text-muted'>Project archived {moment(project.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)}</small>
              </CardFooter>
            </Card>
          </Col>
        )}
      </Row>
    )
  }
}

const projectOptionsInactive = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment',
  limit: 6,
  terms: {
    view: 'collectionWithStatus',
    status: { $in: ['Canceled', 'Wrapped', 'Unknown'] }
  }
}

registerComponent({
  name: 'LatestInactiveProjectUpdates',
  component: LatestInactiveProjectUpdates,
  hocs: [[withMulti, projectOptionsInactive]]
})

class LatestUpdates extends Component {
  render () {
    return (
      <div className='animated fadeIn'>
        <Components.LatestContactUpdates />
        <Components.LatestOfficeUpdates />
        <Components.LatestActiveProjectUpdates />
        <Components.LatestInactiveProjectUpdates />
      </div>
    )
  }
}

const accessOptions = {
  groups: ['members', 'admins'],
  redirect: '/login'
}

registerComponent({
  name: 'LatestUpdates',
  component: LatestUpdates,
  hocs: [[withAccess, accessOptions]]
})
