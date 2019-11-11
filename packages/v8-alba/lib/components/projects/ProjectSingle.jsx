import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import mapProps from 'recompose/mapProps'
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle, Col, Row } from 'reactstrap'
import Interweave from 'interweave'
import styled from 'styled-components'
import moment from 'moment'
import { DATE_FORMAT_LONG, DATE_FORMAT_SHORT } from '../../modules/constants.js'
import { transform } from '../../modules/helpers.js'
import Projects from '../../modules/projects/collection.js'

const SpanVerticalBarBefore = styled.span`
  ::before { content: " | "; };
`

class ProjectSingle extends PureComponent {
  seasonorder (project) {
    if (!project.season) {
      return null
    }

    var so = 'Season Info Missing'
    if (project.renewed && project.status === 'On Hiatus' || project.status === 'Ordered') {
      so = `Renewed for Season ${project.season}`
    } else if (project.status === 'On Hiatus' || project.status === 'Wrapped' || project.status === 'Canceled') {
      so = `Completed Season ${project.season}`
    }
    if (project.status === 'Casting') {
      so = `Season ${project.season}`
    }
    if (project.order) {
      so += ` (${project.order}-episode order)`
    }
    return so
  }

  render () {
    const { currentUser, document, networkStatus } = this.props
    if (networkStatus !== 8 && networkStatus !== 7) {
      return (<div><Components.Loading /></div>)
    }
    if (!document) {
      return (<div><FormattedMessage id='app.404' /></div>)
    }
    const project = document
    const seasonorder = this.seasonorder(project)
    const displayDate =
      'Project added to database ' + moment(project.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(project.updatedAt).format(DATE_FORMAT_LONG)

    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title={`V8 Alba: ${project.projectTitle}`} />
        <Card className='card-accent-danger'>
          <CardHeader tag='h2'>{ project.projectTitle }{ Projects.options.mutations.edit.check(currentUser, project)
            ? <div className='float-right'>
              <Button tag={Link} to={`/projects/${project._id}/edit`}>Edit</Button>
            </div> : null}
          </CardHeader>
          <CardBody>
            <CardTitle className='mb-1'>
              { project.projectType &&
                <span>
                  { project.projectType }
                </span>
              }
              { project.network &&
                <SpanVerticalBarBefore>
                  { project.network }
                </SpanVerticalBarBefore>
              }
              { project.platformType &&
                <SpanVerticalBarBefore>
                  { project.platformType }
                </SpanVerticalBarBefore>
              }
              { project.union &&
                <SpanVerticalBarBefore>
                  { project.union }
                </SpanVerticalBarBefore>
              }
            </CardTitle>
            <CardText className='mb-1'>{ project.status }</CardText>
            { seasonorder &&
              <CardText>{ seasonorder }</CardText>
            }
            {project.htmlSummary
              ? <Interweave content={project.htmlSummary} transform={transform} />
              : <CardText>{ project.summary }</CardText>
            }
            <hr />
            {project.htmlNotes
              ? <Interweave content={project.htmlNotes} transform={transform} />
              : <CardText>{ project.notes }</CardText>
            }
            <hr />
            {project.website &&
            <CardText>
              <CardLink href={project.website} target='_websites'>Open official website <i className='fa fa-external-link' /></CardLink>
            </CardText>
            }
          </CardBody>
          <Row>
            <Col xs='12' lg='6'>
              <CardBody>
                <CardText className='mb-0'>
                  <b>{ project.castingCompany }</b>
                </CardText>
                {project.castingOfficeId &&
                  <Components.OfficeMini documentId={project.castingOfficeId} />
                }
                {project.contacts
                  ? project.contacts.map(contact => <Components.ProjectsContactDetail key={contact.contactId} contact={contact} />)
                  : null }
                {project.addresses
                  ? project.addresses.map(address => <Components.ProjectsAddressDetail key={address} address={address} />)
                  : null }
                {project.contactId}
              </CardBody>
              {project.links &&
              <CardBody>
                <CardText>
                  {project.links.map(link =>
                    <Button className={`btn-${link.platformName.toLowerCase()} text-white`} key={link.profileLink}>
                      <span><CardLink href={link.profileLink} target='_links'>{link.profileName}</CardLink></span>
                    </Button>)}
                </CardText>
              </CardBody>
              }
            </Col>
            <Col xs='12' lg='6'>
              <CardBody>
                <Components.CommentsThread
                  terms={{ objectId: document._id, collectionName: 'Projects', view: 'Comments' }}
                />
            </CardBody>
            </Col>
          </Row>
          <CardFooter>
            <small className='text-muted'>{displayDate}</small>
          </CardFooter>
        </Card>
      </div>
    )
  }
}

const options = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment'
}

const mapPropsFunction = props => ({ ...props, documentId: props.match && props.match.params._id })

registerComponent({
  name: 'ProjectSingle',
  component: ProjectSingle,
  hocs: [
    withCurrentUser,
    mapProps(mapPropsFunction), [withSingle, options] // mapProps must precede withSingle
  ]
})
